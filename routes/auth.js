const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const ObjectID = require("mongodb").ObjectID

function main(userDB){

	// Local Strategy
	passport.use(
		new LocalStrategy((username, password, done)=>{
			userDB.findOne({username: username}, (err, user)=>{
				if(err) return console.log(err);
				if(!user) return done(null, false);
				if(!bcrypt.compareSync(password, user.password)) return done(null, false);
				return done(null, user)
			})
		})
	)

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