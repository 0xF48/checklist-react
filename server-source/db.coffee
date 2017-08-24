p = require 'bluebird'
db = require 'mongoose'
_ = require 'lodash'
fs = require 'fs'
uuid = require 'uuid/v4'
auth = require './auth.coffee'


db.Promise = p
db.connect CFG.database,useMongoClient:yes
db.connection.on('error',console.error.bind(console,'connection error'))

expireLinks = ()->
	TodoGroupLink.remove
		expires: {$lt:new Date()}
	.then (ws)->
		console.log 'removed links: ',ws.result.n




Pin = db.Schema
	is_event: Boolean
	img: String
	text: String
	name: String
	link: String
	link_icon_img: String
	w: 
		type: Number
		default: 1
	h: 
		type: Number
		default: 1
	type:
		type: String
		default: 'photo'
, { timestamps: { createdAt: 'created_at',updatedAt: 'updated_at' } }


Todo = db.Schema
	name: String
	completed_at: Date
	todos: [{
		type: db.Schema.Types.ObjectId
		ref: 'Todo'
	}]
	pins: [{
		type: db.Schema.Types.ObjectId
		ref: 'Pin'
	}]
, { timestamps: { createdAt: 'created_at',updatedAt: 'updated_at' } }


User = db.Schema
	email:
		unique: yes
		type: String
	name: String
	img: String
	auth:
		default: {}
		type: db.Schema.Types.Mixed
	groups: [{ type: db.Schema.Types.ObjectId, ref: 'TodoGroup' }]
	friends: [{ type: db.Schema.Types.ObjectId, ref: 'User' }]
	updated_at:
		type:Date
		default:Date.now
, { timestamps: { createdAt: 'created_at',updatedAt: 'updated_at' } }




User.on 'index', (err)->
	throw new Error 'failed to create user'



User.methods.joinGroup = (id)->
	console.log id
	return new p (res,rej)=>
		TodoGroupLink.findOne 
			_id: id
		.populate('group')
		.then (link)=>
			if !link
				return rej new Error 'link not found'
			if link.expires < Date.now()
				link.remove(link:link)
				return rej new Error 'link expired'
			if link.group.users.indexOf(@_id) > -1
				return rej new Error 'you are already in this list'

			link.group.users.push @_id
			@groups.push link.group
			p.all [
				@save()
				link.group.save()
			]
			.then (group)->
				res(group)


		



	return @toObject()


User.methods.getState = ()->
	return @toObject()


User.statics.signupLocal = (state)->
	if !state || !state.email || !state.pass
		throw new Error 'missing email or password'
	user = new this
		email: state.email
		auth:
			local: 
				email: state.email
				pass: state.pass
	return user.save()

UserModel = db.model('User',User) 

auth(UserModel)




TodoGroupLink = db.Schema
	link: String
	expires: Date
	group: {
		type:  db.Schema.Types.ObjectId
		ref: 'TodoGroup'
	}


TodoGroup = db.Schema
	name: String
	admins: [{
		type:  db.Schema.Types.ObjectId
		ref: 'User'
	}]	
	users: [{
		type: db.Schema.Types.ObjectId
		ref: 'User'
	}]
	state:
		type: db.Schema.Types.Mixed
		default:
			todos: []
, { timestamps: { createdAt: 'created_at',updatedAt: 'updated_at' } }

TodoGroup.pre 'save', (next)->
	for todo in @state.todos
		if todo.todos.length
			done = true
			for sub in todo.todos
				if !sub.completed_at
					done = false
					break
			if done
				todo.completed_at = new Date()
			else
				todo.completed_at = null
	next()


TodoGroup.methods.getInviteLink = ()->
	id = uuid().substring(24)
	link = new TodoGroupLink
		_id: id
		link: CFG.origin+'/api/user/join/'+id
		group: this
		expires: new Date(Date.now()+1000*60*30)
	link.save()

TodoGroup.methods.getState = ()->
	state = @toObject()
	state.users = state.users.map (u)->
		_id: u._id
		name: u.name
	return state



TodoGroupLink = db.model('TodoGroupLink',TodoGroupLink) 
module.exports.Id = db.Schema.Types.ObjectId
module.exports.User = UserModel
module.exports.TodoGroup = db.model('TodoGroup',TodoGroup) 


expireLinks()

