const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy
const FacebookStrategy = require('passport-facebook')
const GoogleStrategy = require('passport-google-oauth20')
const bcrypt = require("bcrypt")
const ObjectID = require("mongodb").ObjectID

function main(userDB){

	// Local Strategy
	passport.use(
		new LocalStrategy((username, password, done)=>{
			userDB.findOne({username: username}, (err, user)=>{
				if(err) return console.log(err);
				if(!user) return done(null, false);
				if(user?.id) return done(null, false)
				if(!bcrypt.compareSync(password, user.password)) return done(null, false);
				return done(null, user)
			})
		})
	)

	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_CLIENT_ID,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
				callbackURL: process.env.FACEBOOK_CALLBACK_URL,
				profileFields: ['email', 'name', 'picture.type(large)']
			},
			(accessToken, refreshToken, profile, done)=>{
				let profileData = profile._json;
				let name = `${profileData.first_name} ${profileData.last_name}`
				userDB.findOneAndUpdate({id: profileData.id},
					{
						$setOnInsert: {
							name: name,
							id: profileData.id,
							img: profileData.picture.data.url,
							type: 'person'
						}
					}, 
					{
						upsert: true,
						returnOriginal: false
					}, (err, user)=>{
						if(err) return done(null, false);
						done(null, user.value) 
					}
				)
			}
		)
	)


	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: process.env.GOOGLE_CALLBACK_URL,
				userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
			}, (accessToken, refreshToken, profile, cb)=>{
				let {sub: id, name, picture: img} = profile._json
				img = img.slice(0, img.length-4)+"400-c";
				userDB.findOneAndUpdate({
					id: id
				}, {
					$setOnInsert: {
						id,
						name,
						img,
						type: 'person'
					}
				},
				{upsert: true,returnOriginal: false},(err, user)=>{
					if(err) return console.log(err);
					cb(null, user.value)
				})
			}))

	passport.serializeUser((user, done)=>{
		console.log("Serializing User")
		done(null, user._id)
	})

	passport.deserializeUser((id, done)=>{
		userDB.findOne({_id: new ObjectID(id)}, (err, user)=>{
			if(err) return done(null, false);
			if(user?.password) delete user.password;
			done(null, user)
		})
	})

}
module.exports = main;