path = require 'path'


# CONFIG
global.CFG = require './config.coffee'


global.INITIAL_VIEW = {}
	# edit_todo_index_sub: null
	# show_pins_todo_index: null
	# show_pins_todo_index_sub: null
	# main_view: 'home'
	# side_view: null
	# show_todo: null
	# edit_list: null
	# edit_todo_index: null
	# slideshow_pins: []
	# slideshow_pin: null





# GLOBALS
PKG = require './package.json'
global._ = require 'lodash'
global.p = require 'bluebird'
global.log = console.log.bind(console)

argv = require 'yargs'
require 'colors'

for key,val of CFG
	if typeof val is 'object'
		argv.command(key,'CFG = '+JSON.stringify(val))
	else if typeof val is 'number'
		argv.command(key,'CFG = '+val).number(key)
	else
		argv.command(key,'CFG = '+val)
argv
.command('verbose')
.alias('v', 'verbose')
.default('verbose',3)
.help('h').alias('h', 'help')

global.argv = argv.argv
argv = global.argv

for key,val of CFG
	if argv[key] and typeof argv[key] is 'object'
		CFG[key] = JSON.parse(argv[key])
	else if argv[key]
		CFG[key] = argv[key]

global.CFG = CFG

global.warn= ->
	if argv.verbose < 0 then return
	args = Array.prototype.slice.call arguments
	args.unshift '[WARN]'
	console.log(args.join(' ').bold.red)
global.info= ->
	if argv.verbose < 1 then return
	args = Array.prototype.slice.call arguments
	args.unshift '[INFO]'
	console.log.apply(console,args)
global.de= ->
	if argv.verbose < 2 then return
	args = Array.prototype.slice.call arguments
	args.unshift '[DEBUG]'
	console.log.apply(console,args)


global.ONE_SECOND = 1000
global.ONE_MINUTE = ONE_SECOND*60
global.ONE_HOUR = ONE_MINUTE*60
global.ONE_DAY = ONE_HOUR*24


global.pt = (json)->
	JSON.stringify json,null,3
















require './server-source/main.coffee'