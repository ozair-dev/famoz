process.env.MONGO_URI="mongodb://ozair_ayaz:ozair_03235146562@cluster0-shard-00-00.gin6e.mongodb.net:27017,cluster0-shard-00-01.gin6e.mongodb.net:27017,cluster0-shard-00-02.gin6e.mongodb.net:27017/famoz?ssl=true&replicaSet=atlas-54gtdi-shard-0&authSource=admin&retryWrites=true&w=majority"
process.env.CLOUDINARY_CLOUD_NAME="ozcom";
process.env.CLOUDINARY_API_KEY="378179385259691";
process.env.CLOUDINARY_API_SECRET="YFNTkouuzemd1E_utvxZoNZGuqY";
process.env.FACEBOOK_CLIENT_ID="443055780091020";
process.env.FACEBOOK_CLIENT_SECRET="05e6909d28ac59773ce85e061e778872";
process.env.FACEBOOK_CALLBACK_URL="http://localhost:5000/user/auth/facebook/callback";
process.env.GOOGLE_CLIENT_ID="893366708424-qh9f2f5mj6oi4dovmcbkpv3mkmfsg7q0.apps.googleusercontent.com";
process.env.GOOGLE_CLIENT_SECRET="28RVsMovmb--eVFYbPIOTfzt";
process.env.GOOGLE_CALLBACK_URL="http://localhost:5000/user/auth/google/callback";
process.env.ORIGIN="http://localhost:3000"
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
const ObjectID = require('mongodb').ObjectID
const passport = require("passport")
const formData = require("express-form-data")
const bodyParser = require("body-parser")
const morgan = require('morgan')
const myDB = require("./connection");
const upload = require("./routes/upload")
const auth = require("./routes/auth")
const user = require("./routes/user")
const chat = require("./routes/chat")
const posts = require("./routes/posts")
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
  }
})
// for storig sessions
const session = require('express-session');
const MongoStore = require("connect-mongo")
const store = MongoStore.create({mongoUrl: process.env.MONGO_URI})

app.use(cors({
	origin: process.env.ORIGIN
}))
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
	const chatDB = await client.db('famoz').collection('chat');
	const postDB = await client.db('famoz').collection('posts')
	io.on('connection', socket=>{
		socket.on('message', doc=>{
			// this emits event stored in chatName variable
			let {chatName, data, sender} = doc
			io.emit(chatName, {data, sender})
				chatDB.findOneAndUpdate({name: chatName}, {$push: {chat: {message: [data], sender}}},{upsert: true, new: true}, (err, data)=>{
				chatNamesArray = chatName.split("-")
				// If chat is between two people, then message info is updated in both users' account
				if(chatNamesArray.length==2){
					chatNamesArray.map(_id=>chatNamesArray.map(otherId=>{
						if(_id!==otherId) userDB.updateOne({_id: new ObjectID(_id)}, {$pull: {messages: {_id: new ObjectID(otherId)}}}, (err, data)=>{
							userDB.findOne({_id: new ObjectID(otherId)}, (err, doc)=>{
								if(err) return console.log(err);
								if(doc){
									let {_id: userId, username, name, img, type} = doc
									io.emit(_id, {_id: userId, username, name, img, type})
									userDB.updateOne({_id: new ObjectID(_id)}, {$push: { messages: {_id: userId, username, name, img, type}}}, (err, data)=>{
									})
								}
							})
						});
					}))
				}
				// if it is group chat, then message info is updates in all users' account
				else if(chatNamesArray.length==1){
					userDB.findOne({_id: new ObjectID(chatName)}, (err, data)=>{
						let {_id: userId, username, name, img, type} = data;
						io.emit("new group chat", {_id: userId, username, name, img, type})
						userDB.updateMany({}, {$pull: {messages: {_id: new ObjectID(chatName)}}}, (err, doc)=>{
							if(err) return console.log(err);
							userDB.updateMany({}, {$push: {messages: {_id: userId, username, name, img, type}}}, (err, data)=>{
							})	
						})
					})
				}

			})
		})

		socket.on('post', data=>{
			postDB.insertOne(data, (err, data)=>{
				io.emit('new-post', data.ops[0])
			})
		})

		socket.on("update-post", doc=>{
			io.emit(doc._id, doc)
			if(doc.type==="comment"){
				postDB.findOneAndUpdate({_id: new ObjectID(doc._id)}, {$push: {"post.comments": doc.comment}}, {})
			}
			else{
				const {_id} = doc;
				delete doc._id;
				let data = {}
				Object.keys(doc).map(i=>data["post."+i]=doc[i])
				postDB.findOneAndUpdate({_id: new ObjectID(_id)},{$set: data})
			}
		})

		socket.on('disconnect', ()=>{
		})
	})
	app.use("/user", user(userDB))
	app.use("/chat", chat(chatDB))
	app.use('/posts', posts(postDB))
	app.use("/upload", upload(cloudinary))
	auth(userDB)
	app.route("/").get((req, res)=>{
		res.send("Working")
	})
	// if (process.env.NODE_ENV === 'production') {
	//     app.use(express.static('client/build'));
	// }
	// app.get("*", (req, res)=>{
	// 	res.redirect("/")
	// })

}).catch((e)=>{
    app.route('/').get((req, res)=>{
    	res.send("Error loading the page")
    })

})

http.listen(port, ()=>{
	console.log("App is live on the port "+port)
})