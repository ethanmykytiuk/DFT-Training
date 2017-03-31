"use strict";

var server = require("./server.js");
var http = require("http");
var localHostUrl = "http://localhost:8080";

exports.tearDown = function(done) {
    server.stop(function(){
        done();
    });  
    
};

exports.test_serverReturnsHelloWorld = function(test) {
    server.start();
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
            test.equals(receivedData, true, "should have received data here");
            test.done(); 
        });
    });

};
/*
exports.testNothing = function(test) {
    test.equals(3,server.number(), "Numbers are not equal!");
    test.done();
};
*/