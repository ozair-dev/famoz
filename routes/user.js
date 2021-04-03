const router = require("express").Router()
const passport = require('passport')
const bcrypt = require("bcrypt")
const ObjectID = require('mongodb').ObjectID
module.exports = (userDB)=>{
	// To get the current user
	router.get("/", (req, res)=>{
		let user = req.user||null
		res.send(user)
	})

	router.post("/find", (req, res)=>{
		let {query} = req.body;
		userDB.find({$or: [{username: {$regex: `.*${query}.*`, $options: 'i'}}, {name: {$regex: `.*${query}.*`, $options: 'i'}}]}).toArray((err, data)=>{
			if(err) return console.log(err);
			res.send(data)
		}) 
	})

	router.get("/all", (req, res)=>{
		userDB.find({}).toArray((err, data)=>{
			if(err) return console.log(err)
			res.send(data)
		})
	})
	// To login
	router.post("/", passport.authenticate("local"), (req, res)=>{
		let user=req.user||null
		res.send(user)
	})

	// To signup
	router.post("/signup", (req, res)=>{
		let formData = req.body;
		for(let i in formData){
			if(!formData[i]) return res.status(404).end();
		}
		let {name, username, password, img} = formData;
		username = username.toLowerCase();
		userDB.findOne({username: username}, (err, doc)=>{
			if(err) return console.log(err);
			if(doc) return res.status(400).end();
			// Hashing the password
			password = bcrypt.hashSync(password, 12)
			let type = 'person'
			userDB.insertOne({username, password,name, img, type}, (err, user)=>{
				if(err) return console.log(err);
				res.status(200).end();
			})
		})
	})
	// to create a group
	router.get("/group/:pass", (req, res)=>{
		let {pass} = req.params;
		if(pass == "ozairfamily" && req.user){
			userDB.findOneAndUpdate({_id: new ObjectID(req.user._id)}, {$set: {name: req.user.name+" (Group)", type:"group"}}, (err, data)=>{
				if(err) return console.log(err);
				res.redirect("/")
			})
		}
		// let formData = req.body;	
		// for(let i in formData){
		// 	if(!formData[i]) return res.status(404).end();
		// }
		// let {name, username, password, img} = formData;
		// username = username.toLowerCase();
		// name+=" Group"
		// userDB.findOne({username: username}, (err, doc)=>{
		// 	if(err) return console.log(err);
		// 	if(doc) return res.status(400).end();
		// 	// Hashing the password
		// 	password = bcrypt.hashSync(password, 12)
		// 	let type = 'group'
		// 	userDB.insertOne({username, password,name, img, type}, (err, user)=>{
		// 		if(err) return console.log(err);
		// 		res.status(200).end();
		// 	})
		// })
	})
	// Change dp
	router.post("/change-dp", (req, res)=>{
		const {img} = req.body;
		const {_id} = req.user;
		userDB.findAndModify({_id: new ObjectID(_id)}, {}, {$set: {img}}, {upsert: false, new: true}, (err, data)=>{
			if(err) return res.status(404).end();
			res.send(data.value)
		})
	})

	router.post("/update", (req, res)=>{
		let formData = req.body;
		let {password, username, _id} = formData;
		delete formData._id;
		username = username.toLowerCase()
		formData.username = username
		if(password){
			let hash = bcrypt.hashSync(password, 12)
			formData.password = hash;
		}
		for(let i in formData){
			if(!formData[i]) return res.status(400).end();
		}
		userDB.findOne({username: formData.username}, (err, data)=>{
			if(err) return console.log(err);
			if(data && String(data._id) !== _id) return res.status(400).end();
			
			userDB.findOneAndUpdate({_id: new ObjectID(_id)},{$set: formData}, {returnOriginal:false}, (err, doc)=>{
				if(err) return console.log(err);
				res.send(doc.value)
			})
		})
	})

	router.get("/logout", (req, res)=>{
		if(req.user) req.logout();
		res.status(200).end();
	})

	router.get("/auth/facebook", passport.authenticate('facebook'))
	router.get("/auth/facebook/callback", passport.authenticate('facebook'), (req, res)=>{
		res.redirect(process.env.ORIGIN)
	})
	router.get("/auth/google", passport.authenticate("google", {scope: ['profile']}))
	router.get("/auth/google/callback", passport.authenticate('google'), (req, res)=>{
		res.redirect(process.env.ORIGIN)
	})
	return router;
}