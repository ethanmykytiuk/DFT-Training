"use strict";

var server = require("./server.js");
var http = require("http");
var localHostUrl = "http://localhost:8080";

exports.testHttpServer = function(test) {
    server.start();
    
    http.get(localHostUrl, function(response){
        
    });
    test.done();
};

/*
exports.testNothing = function(test) {
    test.equals(3,server.number(), "Numbers are not equal!");
    test.done();
};
*/