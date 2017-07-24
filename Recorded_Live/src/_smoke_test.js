// launch server same way it happens in producion
// get a page
// confirm we got something

(function() {
    "use strict";
    var http = require("http");
	var child_process = require("child_process");

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
		var child = child_process.spawn("node", ["src/server/weewikipaint", "8080"]);
		child.stdout.setEncoding("utf8");
		child.stdout.on("data", function(chunk) {
			process.stdout.write("server stdout: " + chunk);
			if (chunk.trim() === "Server started") callback();
		});
		child.stderr.on("data", function(chunk) {
			process.stdout.write("server stderr: " + chunk);
		});
		child.on("exit", function(code, signal) {
			console.log("Server process exited with code [" + code + "] and signal [" + signal + "]");
		});
	}
    
    
    /******** TESTS ********/

	exports.test_for_smoke = function(test) {
		runServer(function(){
			console.log("callback called");
            httpGet("http://localhost:8080", function(response, receivedData) {
				console.log("got file");
				test.done();
			});
        });
	};
    
    
    
    
}());
