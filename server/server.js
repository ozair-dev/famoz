process.env.MONGO_URI="mongodb://ozair_ayaz:ozair_03235146562@cluster0-shard-00-00.gin6e.mongodb.net:27017,cluster0-shard-00-01.gin6e.mongodb.net:27017,cluster0-shard-00-02.gin6e.mongodb.net:27017/famoz?ssl=true&replicaSet=atlas-54gtdi-shard-0&authSource=admin&retryWrites=true&w=majority"
process.env.CLOUDINARY_CLOUD_NAME="ozcom";
process.env.CLOUDINARY_API_KEY="378179385259691";
process.env.CLOUDINARY_API_SECRET="YFNTkouuzemd1E_utvxZoNZGuqY";
const port = process.env.PORT || 5000;

const express = require("express");

// Using cloudinary api for image hosting
const cloudinary = require("cloudinary");
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cors = require("cors");
const passport = require("passport")
const formData = require("express-form-data")
const bodyParser = require("body-parser")
const morgan = require('morgan')
const myDB = require("./connection");
const upload = require("./routes/upload")
const auth = require("./routes/auth")
const user = require("./routes/user")
const app = express();
// for storig sessions
const session = require('express-session');
const MongoStore = require("connect-mongo")
const store = MongoStore.create({mongoUrl: process.env.MONGO_URI})

app.use(cors())
app.use(
	session({
		secret: 'asdf',
		store: store,
		resave: true, 
		saveUninitialized: true,
		cookie: {
			maxAge: 2592000000
		}
	})
)
app.use(passport.initialize())
app.use(passport.session())
app.use(formData.parse())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(morgan('dev'))
myDB(async (client) => {
	const userDB = await client.db('famoz').collection('users');
	app.use("/user", user(userDB))
	app.use("/upload", upload(cloudinary))
	auth(userDB)
	app.route("/").get((req, res)=>{
		res.send("Working")
	})

}).catch((e)=>{
    app.route('/').get((req, res)=>{
    	res.send("Error loading the page")
    })

})

app.listen(5000, ()=>{
	console.log("App is live on the port "+port)
})