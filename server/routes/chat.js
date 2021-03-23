const router = require('express').Router();
module.exports = (chatDB)=>{
	// to query chat with chat _id (chatName) and index(i)
	router.get("/:chatName/:i", (req, res)=>{
		let {chatName, i} = req.params
		i = Number(i)
		chatDB.findOne({name: chatName}, {projection: {chat: {$slice: [{$reverseArray: "$chat"},i, 20]}}} , (err, data)=>{
			if(err) return console.log(err);
			if(data){
				data.chat = data.chat.reverse();
			}
			res.send(data)
		})
	})
	return router;
}
