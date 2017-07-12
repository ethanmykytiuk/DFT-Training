"use strict";
var PORT = "8080";

var server = require("./server.js");
var http = require("http");
var fs = require("fs");
var localHostUrl = "http://localhost:8080";

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

exports.test_serverReturnsHelloWorld = function(test) {
    server.start(8080);
    var request = http.get(localHostUrl);
    request.on("response", function(response) {
        var receivedData = false;
        response.setEncoding("utf8");
        test.equals(200, response.statusCode);
        
        response.on("data", function(chunk){
            receivedData = true;
            test.equals("Hello World!", chunk, "response text");
        });
        response.on("end", function(){
            test.ok(receivedData, true, "should have received data here");
            server.stop(function(){
                    test.done();
            });
        });
    });
};

exports.test_serverServesAFile = function(test) {
    var testDir = "generated/test";
    var testFile = testDir + "/test.html";
    try{
        fs.writeFileSync(testFile, "Hello World");   
        test.done();
    }
    finally{
        fs.unlinkSync(testFile);
        test.ok(!fs.existsSync(testFile), "file should have been deleted");
    }
};

exports.test_serverRequiresPortNumber = function(test) {
    test.throws(function() {
        server.start();
    });
    test.done();
};

exports.test_serverRunsCallbackWhenStopCompletes = function(test) {
    server.start(8080);
    server.stop(function(){
        test.done();
    });
};

exports.test_serverRunsCalledWhenServerIsntRunningThrowsException = function(test) {
    server.stop(function(err){
       test.notEqual(err, undefined);
        test.done();
    });
};