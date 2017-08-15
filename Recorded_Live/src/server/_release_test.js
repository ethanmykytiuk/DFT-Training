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
    
    /********** HELPER METHODS ************/
    
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
    
    /******** TESTS ********/
    
	exports.test_isOnWeb = function(test) {
        httpGet("http://weewikipaint-emdevfacto.herokuapp.com", function(response, receivedData) {
            var foundHomePage = receivedData.indexOf("WeeWikiPaint home page") !== -1;
            test.ok(foundHomePage, "Home page should have contained WeeWikiPaint marker");
            test.done();
        });
	};
       
}());
