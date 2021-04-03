const router = require("express").Router();
function main(cloudinary){
	// for generating link to low quality images
	function optimize(url){
		let imgUrl = url.split("/")
		imgUrl.splice(6,1,"q_auto:low")
		return imgUrl.join("/")
	}
	// to upload single pic, (profile pic)
	router.post("/", (req, res)=>{
		let image = req.files[0]
		cloudinary.uploader
		.upload(image.path, {secure: true})
		.then(img=>{
			let imgUrl = img.url.split("/")
			imgUrl.splice(6,1,"w_1500,h_1500,c_crop,g_face/q_auto:low,w_400,h_400")
			res.send(imgUrl.join("/"))
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