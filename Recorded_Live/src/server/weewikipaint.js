(function() { 
    "use strict";
    var HOME_PAGE = "src/server/content/homepage.html";
    var ERROR_PAGE = "src/server/content/404.html";
    
    var server = require("./server.js");
    server.start(HOME_PAGE, ERROR_PAGE, 8080, function(){
        console.log("Server started");        
    });
}());