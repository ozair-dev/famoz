const router = require('express').Router()
module.exports = (postsDB)=>{

	router.get("/:ind", (req, res)=>{
		let {ind} = req.params;
		ind = Number(ind)
		postsDB.find({}).toArray((err, data)=>{
			if(err) return console.log(err);
			data = data.reverse().slice(ind, ind+10)
			res.json(data.reverse())
		})
	})

	return router;

}