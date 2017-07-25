(function() { 
    "use strict";
    var HOME_PAGE = "src/server/content/homepage.html";
    var ERROR_PAGE = "src/server/content/404.html";
    
    var server = require("./server.js");
    var port = process.argv[2];
    server.start(HOME_PAGE, ERROR_PAGE, port, function(){
        console.log("Server started");        
    });
}());