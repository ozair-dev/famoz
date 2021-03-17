const router = require("express").Router();
function main(cloudinary){
	// for uploading a single image(profile pic)
	function optimize(url){
		let imgUrl = url.split("/")
		imgUrl.splice(6,1,"w_1500,h_1500,c_crop,g_face/q_auto:low")
		return imgUrl.join("/")
	}
	router.post("/", (req, res)=>{
		let image = req.files[0]
		cloudinary.uploader
		.upload(image.path, {secure: true})
		.then(img=>{
			res.send(optimize(img.url))
		})
	})
	// for uploading one or more pics
	router.post("/many", (req, res)=>{
		let values = Object.values(req.files)
		const promises = values.map(image => cloudinary.uploader.upload(image.path, {secure: true}))
		Promise
		.all(promises)
	    .then(results => {
	    	let arr = results.map(item=>optimize(item.url))
	    	res.send(arr)
	    })
	})
	return router
}
module.exports = main