(function() {
    "use strict";
    
    /********** CONSTANTS ************/

    var PORT = "8080";

    var server = require("./server.js");
    var http = require("http");
    var fs = require("fs");
    var assert = require("assert");

    var localHostUrl = "http://localhost:8080";
    var TEST_FILE = "generated/test/test.html";

    /********** HELPER METHODS ************/
    function httpGet(url, callback){
        server.start(TEST_FILE, 8080);
        var request = http.get(url);
        request.on("response", function(response) {
            var receivedData = "";
            response.setEncoding("utf8");

            response.on("data", function(chunk) {
                receivedData += chunk;
            });
            response.on("end", function() {
                server.stop(function() {
                    callback(response, receivedData);
                });
            });
        });
    }   
    
    /********** TESTS ************/

    exports.tearDown = function(done) {
        if (fs.existsSync(TEST_FILE)) {
            fs.unlinkSync(TEST_FILE);
            assert.ok(!fs.existsSync(TEST_FILE), "could not deleted test file: [" + TEST_FILE + "]");
        }
        done();
    };

    exports.test_servesHomePageFromFile = function(test) {
        var testDir = "generated/test";
        var expectedData = "This is served from a file";

        fs.writeFileSync(TEST_FILE, expectedData);
            
        httpGet("http://localhost:8080", function(response, responseData){
            test.equals(200, response.statusCode, "status code");                
            test.equals(expectedData, responseData, "response text");
            test.done();
        });        
    };

    exports.test_returns404ForEverythingExceptHomePage = function(test) {
        httpGet("http://localhost:8080/bargle", function(response, responseData){
            test.equals(404, response.statusCode, "status code");
            test.done();
        });
    };

    exports.test_returnsHomePageWhenAskedForIndex = function(test) {
        var testDir = "generated/test";
        fs.writeFileSync(TEST_FILE, "foo");
            
        httpGet("http://localhost:8080/index.html", function(response, responseData){
            test.equals(200, response.statusCode, "status code");                
            test.done();
        });     
    };
    
    exports.test_requiresFileToServe = function(test) {
        test.throws(function() {
            server.start();
        });
        test.done();
    };

    exports.test_requiresPortNumber = function(test) {
        test.throws(function() {
            server.start();
        });
        test.done();
    };

    exports.test_runsCallbackWhenStopCompletes = function(test) {
        server.start(TEST_FILE, 8080);
        server.stop(function(){
            test.done();
        });
    };

    exports.test_runsCalledWhenServerIsntRunningThrowsException = function(test) {
        server.stop(function(err){
           test.notEqual(err, undefined);
            test.done();
        });
    };

}());

/*
exports.setUp = function(done) {
    server.start(8080);
    done();
};

exports.tearDown = function(done) {
    server.stop(function(){
        done();
    });     
};
*/