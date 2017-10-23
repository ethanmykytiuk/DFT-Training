/*global dump, $, Raphael, wwp:true*/

wwp = {};

(function() {
	"use strict";
       
    var paper;
    
    wwp.initializeDrawingArea = function(drawingAreaElement){
        var prevX = null;
        var prevY = null;
        
        var isDragging = false;
        var jqArea = $(drawingAreaElement);
        
        //TODO in test: if mouse clicked when outside of element, or let go outside of element
        // isDragging state may get stuck
        jqArea.mousedown(function(event){
           isDragging = true; 
        });
        
        jqArea.mouseup(function(event){
           isDragging = false; 
        });
        
        paper = new Raphael(drawingAreaElement);
        $(drawingAreaElement).mousemove(function(event){
            
            var divPageX = jqArea.offset().left;
            var divPageY = jqArea.offset().top;
            var relativeX = event.pageX - divPageX;
            var relativeY = event.pageY - divPageY;
            
            if(prevX !== null && isDragging) wwp.drawLine(prevX, prevY, relativeX, relativeY);
            prevX = relativeX;
            prevY = relativeY;
        });
        
        return paper;
    };
    
    wwp.drawLine = function(startX, startY, endX, endY) {
			paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
		};
	
}());