const router = require("express").Router()
const passport = require('passport')
const bcrypt = require("bcrypt")
module.exports = (userDB)=>{
	// To get the current user
	router.get("/", (req, res)=>{
		let user = req.user||null
		res.send(user)
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
		userDB.findOne({username: username}, (err, doc)=>{
			if(err) return console.log(err);
			if(doc) return res.status(400).end();
			// Hashing the password
			password = bcrypt.hashSync(password, 12)
			userDB.insertOne({username, password,name, img}, (err, user)=>{
				if(err) return console.log(err);
				res.status(200).end();
			})
		})
	})

	router.get("/logout", (req, res)=>{
		if(req.user) req.logout();
		res.status(200).end();
	})
	return router;
}