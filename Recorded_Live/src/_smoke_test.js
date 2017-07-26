// launch server same way it happens in producion
// get a page
// confirm we got something

(function() {
    "use strict";
    var http = require("http");
	var child_process = require("child_process");
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
   
    
	function runServer(callback) {
		child = child_process.spawn("node", ["src/server/weewikipaint", "8080"]);
		child.stdout.setEncoding("utf8");
		child.stdout.on("data", function(chunk) {
			process.stdout.write("server stdout: " + chunk);
			if (chunk.trim() === "Server started") callback();
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
        httpGet("http://localhost:8080", function(response, receivedData) {
            var foundHomePage = receivedData.indexOf("WeeWikiPaint home page") !== -1;
            test.ok(foundHomePage, "Home page should have contained WeeWikiPaint marker");
            test.done();
        });
	};
    
    exports.test_canGet404Page = function(test) {
        httpGet("http://localhost:8080/abcd.html", function(response, receivedData) {
            var found404Page = receivedData.indexOf("WeeWikiPaint 404 page") !== -1;
            test.ok(found404Page, "404 page should have contained WeeWikiPaint marker");
            test.done();
        });
	};
    
    
    
}());
