// launch server same way it happens in producion
// get a page
// confirm we got something

/*jshint regexp:false*/

(function() {
    "use strict";
    var http = require("http");
	var child_process = require("child_process");
    var fs = require("fs");
    var child;
    
    var TEST_HOME_PAGE = "generated/test/testHome.html";
    var TEST_404_PAGE = "generated/test/test404.html";
    
    /********** HELPER METHODS ************/
    
    // TODO: Eliminate duplication
    function httpGet(url, callback){
        var request = http.get(url);
        request.on("response", function(response) {
            var receivedData = "";
            response.setEncoding("utf8");

            response.on("data", function(chunk) {
                receivedData += chunk;
            });
            response.on("end", function() {
                callback(response, receivedData);
            });
        });
    }   
   
    function parseProcFile(){
        var procFile = fs.readFileSync("Procfile", "utf8");
		var matches = procFile.trim().match(/^web:(.*)$/);     // matches 'web: foo bar baz'

        if (matches === null) 
            throw "Could not parse Procfile";
		var commandLine = matches[1];

		var args = commandLine.split(" ");

        args = args.filter(function(element) {
			return (element.trim() !== "");
		});
		args = args.map(function(element) {
			if (element === "$PORT") return "5000";
			else return element;
		});

		return args;
    }
    
	function runServer(callback) {
        var commandLine = parseProcFile();
        
		child = child_process.spawn(commandLine[0], commandLine.splice(1));
        
		child.stdout.setEncoding("utf8");
		child.stdout.on("data", function(chunk) {
			if (chunk.trim().indexOf("Server started") !== -1) callback();
		});
	}    
    
    /******** TESTS ********/

    exports.setUp = function(done) {
        runServer(done);
    };
    
    exports.tearDown = function(done){
        child.on("exit", function(code, signal){
            done();
        });
        child.kill();
    };
    
	exports.test_canGetHomePage = function(test) {
        httpGet("http://localhost:5000", function(response, receivedData) {
            var foundHomePage = receivedData.indexOf("WeeWikiPaint home page") !== -1;
            test.ok(foundHomePage, "Home page should have contained WeeWikiPaint marker");
            test.done();
        });
	};
    
    exports.test_canGet404Page = function(test) {
        httpGet("http://localhost:5000/abcd.html", function(response, receivedData) {
            var found404Page = receivedData.indexOf("WeeWikiPaint 404 page") !== -1;
            test.ok(found404Page, "404 page should have contained WeeWikiPaint marker");
            test.done();
        });
	};
    
    
    
}());
