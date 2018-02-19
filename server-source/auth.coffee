passport = require('passport')
# passport_twitter = require('passport-twitter')
LocalStrategy = require('passport-local').Strategy
# twitter_secret = CFG.auth.twitter.secret
# twitter_key = CFG.auth.twitter.key
# twitter_cb_url = CFG.origin+":"+CFG.port+"/auth/twitter/callback"

# de '[twitter_cb_url]', twitter_cb_url

cred_err_msg = 'bad username/password'

module.exports = (User)->

	local_strat = new LocalStrategy 
		usernameField: 'email'
		passwordField: 'pass'
		session: yes
	,(email,pass,done)->
		

		User.findOne
			email: email
		.populate 'groups'
		.then (user)->
			if !user
				return done new Error cred_err_msg
			if !user.auth.local
				return done new Error cred_err_msg
			check = user.auth.local.pass == pass

			error = if !check then new Error cred_err_msg else null
			user = if check then user else null
			done(error,user)
		.catch (err)->
			return done(new Error err.message)



	# TwitterStrategy = new passport_twitter
	# 	consumerKey: twitter_key
	# 	consumerSecret: twitter_secret
	# 	callbackURL: twitter_cb_url
	# ,(token, tokenSecret, tw_profile, cb)->
	# 	User.findOneOrCreate 
	# 		auth: 
	# 			twitter:
	# 				id: tw_profile.id
	# 	.then (profile)->
	# 		cb(null,profile)
	# 	.catch (err)->
	# 		cb(err)




	# passport.use(TwitterStrategy)
	passport.use(local_strat)



	passport.serializeUser (user,done)->
		done(null,user._id)

	passport.deserializeUser (id,done)->
		User.findOne
			_id : id
		.populate 'groups'
		.populate 'friends'
		.then (user)->
			done(null,user)
		.catch done


