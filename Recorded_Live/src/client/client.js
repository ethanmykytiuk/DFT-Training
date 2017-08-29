/*global dump, Raphael, wwp:true*/

wwp = {};

(function() {
	"use strict";
        
    wwp.initializeDrawingArea = function(drawingAreaElement){
        var paper = new Raphael(drawingAreaElement);
        return paper;
    };
	
}());