var http = require("http");
var jsdom = require("jsdom");
var path= require("path");
var fs = require("fs");
var mime = require("mime");
var url = require("url");

var server = http.createServer( function (req, res) {
	req.setEncoding("utf8");
	req.content = "";
	req.on("data", function(content) {
		req.content += content;
	});

	req.on("end", function() {
		if(req.content) {
			var values = req.content.split('&');
			var data = [];

			for(var valueIndex in values) {
				var pair = values[valueIndex].split('=');
				data[pair[0]] = pair[1];
			}
		}

		var bbRequest = {
			write: write, 
			writeFile: writeFile, 
			writeNotFound: writeNotFound, 
			ready: false, 
			url: req.url,
			method: req.method,
			data: data,
			origin: { 
				req: req, 
				res: res 
			}
		}; 

		httpHandler( bbRequest );
	});

});

server.listen(1337, "127.0.0.1");

httpHandler = function(req) {
	if(req.url === "/proxy.html")
		proxyHandler(req);
	else {
		if(req.url === "/")
			req.url = "/index.html";
		var path = process.cwd() + "/htdocs" + req.url;

		req.writeFile(path);
	}
};

function proxyHandler(req) {
	var urlObj = url.parse(unescape(req.data.url));
	var options = {
		host: urlObj.hostname,
		port: 80,
		path: urlObj.pathname
	};

	http.get(options, function(res) {
		res.setEncoding("utf8");
		var content = "";
		res.on("data", function(chunk) {
			content += chunk;
		});

		res.on("end", function() {
			req.write(content, 200, {"Content-Type": "text/html"});
		});
	});
}

write = function(response, status, header, encoding) {
	if(!status) {
		status = 200;
	}

	if(!header) {
		header = {"Content-Type": "text/plain"};
	}

	if(!encoding) {
		encoding = "utf8";
	}

	this.origin.res.writeHead(status, header);
	this.origin.res.write(response, encoding);
	this.origin.res.end();
};

writeFile = function(filename, status) {
	if(!status) {
		status = 200;
	}

	var req	= this;
	path.exists(filename, function(exists) {
		if(!exists) {
			req.writeNotFound();
		} else {
			fs.readFile(filename, "binary", function(err, file) {
				if(err) {
					req.write( 500, err );
				} else {
					var mimeType = mime.lookup(filename);
					req.write(file, status, {"Content-Type": mimeType}, "binary");
				}
			});	
		}
	});
};

writeNotFound = function() {
	var req	= this;
	var filename = process.cwd() + "/htdocs/404.html";
	path.exists(filename, function(exists) {
		if(!exists) {
			req.write("Not Found", 404);
		} else {
			req.writeFile(filename, 404);
		}
	});
};
