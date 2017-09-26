/*global dump, Raphael, wwp:true*/

wwp = {};

(function() {
	"use strict";
        
    wwp.initializeDrawingArea = function(drawingAreaElement){
        var paper = new Raphael(drawingAreaElement);
        
        paper.path("M20,30L200,20")
        
        return paper;
    };
	
}());