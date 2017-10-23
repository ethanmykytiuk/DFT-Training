/*global dump, $, Raphael, wwp:true*/

wwp = {};

(function() {
	"use strict";
       
    var paper;
    
    wwp.initializeDrawingArea = function(drawingAreaElement){
        paper = new Raphael(drawingAreaElement);
        $(drawingAreaElement).click(function(event){
            
            var divPageX = $(drawingAreaElement).offset().left;
            var divPageY = $(drawingAreaElement).offset().top;
            var relativeX = event.pageX - divPageX;
            var relativeY = event.pageY - divPageY;
            
            
            wwp.drawLine(0,0,relativeX, relativeY);
        });
        
        return paper;
    };
    
    wwp.drawLine = function(startX, startY, endX, endY) {
			paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
		};
	
}());