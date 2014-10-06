var path = require('path'),
	rootPath = path.normalize(__dirname + "/../../");

module.exports = {
	"development": {
		rootPath: rootPath,
		db: "mongodb://localhost/estore",
		port: process.env.PORT || 3030,
		dataDirPath: "/../data/"
	},
	"production": {
		rootPath: rootPath,
		db: "mongodb://localhost/estore",
		port: process.env.PORT || 3030,
		dataDirPath: "/../data/"
	}
}