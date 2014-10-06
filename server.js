var express = require("express"),
	app = express(),
	env = process.env.NODE_ENV || "development";
	config = require('./server/configs/config')[env];

	require('./server/configs/express')(app, config);
	require('./server/configs/mongoose')(config);
	require('./server/configs/routes')(app, config);

app.listen(config.port);
console.log("Server running at: " + config.port)