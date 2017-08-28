/*global dump, Raphael, wwp:true*/

wwp = {};

(function() {
	"use strict";
    
    //var raphael = Raphael;

    wwp.createElement = function(){
		var div = document.createElement("div");
		div.setAttribute("id", "tdjs");
		div.setAttribute("foo", "bar");
		document.body.appendChild(div);

		dump("Window loaded");    
    };
    
    wwp.initializeDrawingArea = function(drawingAreaId){
        var paper = new Raphael(drawingAreaId);
    };
	
}());