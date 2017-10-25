/*global dump, $, Raphael, wwp:true*/

wwp = {};

(function() {
	"use strict";
       
    var paper;
    
    wwp.initializeDrawingArea = function(drawingAreaElement){
        paper = new Raphael(drawingAreaElement);
        
        var drawingArea = $(drawingAreaElement);
        
        drawingArea.click(function(event){
            var topLeft = drawingArea.offset();
            //var topBorder = parseInt(drawingArea.css("border-top-width"), 10);
            //var leftBorder = parseInt(drawingArea.css("border-left-width"), 10);
            
            wwp.drawLine(0, 0, event.pageX - topLeft.left, event.pageY - topLeft.top);
        });
        /*
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
        
        $(drawingAreaElement).mousemove(function(event){
            
            var divPageX = jqArea.offset().left;
            var divPageY = jqArea.offset().top;
            var relativeX = event.pageX - divPageX;
            var relativeY = event.pageY - divPageY;
            
            if(prevX !== null && isDragging) wwp.drawLine(prevX, prevY, relativeX, relativeY);
            prevX = relativeX;
            prevY = relativeY;
        });
        */
        
        return paper;
    };
    
    wwp.drawLine = function(startX, startY, endX, endY) {
			paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
		};
	
}());