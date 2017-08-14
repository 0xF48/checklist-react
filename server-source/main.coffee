# lib
express = require 'express'
session = require('express-session')
bodyParser = require 'body-parser'
path = require 'path'
uuid = require 'uuid/v4'
fs = require 'fs'
mongoose = require 'mongoose'
Busboy = require('busboy')
passport = require 'passport'
api = require './api.coffee'
# session
redis   = require "redis"
redisStore = require('connect-redis')(session)
redis_client  = redis.createClient()
session_store = new redisStore({ host: 'localhost', port: 6379, client: redis_client,disableTTL:true });
app_session = session
	genid: (req)->
		return uuid()
	resave: false
	saveUninitialized: false
	secret: 'LAS41jSD923jxc2'
	store: session_store
	cookie:
		maxAge: Infinity
		_expires : Infinity



app = express()
app
.set 'view engine','pug'
.set 'views','./client-views'
.use('/static', express.static './client-static')
.use('/data', express.static './data')
.use bodyParser.json()
.use app_session
.use bodyParser.urlencoded extended:no
.use(passport.initialize())
.use(passport.session())






init_state =
	users: [
			id : uuid()
			name: 'Bianca'
			img: '/data/bianca.png'
		,
			id : uuid()
			name: 'Yury'
			img: '/data/yury.jpg'
	]
	lists : [
			name: 'Our Todos'
			created_at: 0
			id : uuid()
			participants: [
					id : uuid()
					name: 'Bianca'
					img: '/data/bianca.png'
				,
					id : uuid()
					name: 'Yury'
					img: '/data/yury.jpg'
			]
			todos: [
					id: uuid()
					name: 'go on a date :P'
					created_at: new Date(1)
					completed_at: new Date(1)
					pins: [
							id : uuid()
							img: '/data/date-plan.jpeg'
							w: 1
							h: 1
							type: 'photo'
						,
							id : uuid()
							is_event: yes
							name: 'our date!'
							img: '/data/date.jpg'
							w: 2
							h: 1
							type: 'photo'
						,
							id : uuid()
							w: 2
							h: 2
							type: 'textsms'
							text: 'this is a text pin'
						,
							id : uuid()
							w: 1
							h: 1
							type: 'link'
							link: 'google.com'
							link_icon_img: 'http://www.google.com/s2/favicons?domain=google.com'
							text: 'this is a link pin'
					]
					todos: []
				,
					id: uuid()
					name: 'go on a sailing trip'
					created_at: Date.now()
					completed_at: null
					pins: []
					todos: [
							id: uuid()
							name: 'buy used boat'
							created_at: Date.now()
							completed_at: null
							pins: []
						,
							id: uuid()
							name: 'rig it'
							created_at: Date.now()
							completed_at: null
							pins: []
					]
			]
	]


app.use api.bindRequest

# main view
app.get '/', (req,res)->
	res.render 'app',
		state: api.getState(req)

# api route
app.use '/api/', api.router


# global 404 view
app.get '*', (req,res,next)->
	res.render 'app',
		state:
			error: 'page not found'
	# res.sendStatus(404)

# global error view
.use (err, req, res, next)->
	if err.message.match('duplicate key error index')
		return res.json
			error: 'oops, duplicate found'
	res.json
		error: err.message
	throw err




server = app.listen CFG.port, ->
	info '- checki -'.bold.cyan
	info 'mode:',CFG.mode.bold
	info 'port:',String(server.address().port).bold




