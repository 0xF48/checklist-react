path = require 'path'
module.exports =
	save_dir: path.join(__dirname,'/data')
	save_url: '/data'
	origin: "http://localhost:8787"
	port: 8787
	mode: 'dev'
	database: 'mongodb://localhost:27017/checki'
	auth: 
		twitter:
			key: "DxreKjPMqlegl7I3DwPy9M96x"
			secret: "0aYjKUSGdcpIjHmCNaEixKjo6mxD7F2Wf5BfwpniEVL359qmec"