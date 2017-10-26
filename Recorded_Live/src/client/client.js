/*global dump, $, Raphael, wwp:true*/

wwp = {};

(function() {
	"use strict";
       
    var paper;
    
    function relativeOffset(drawingArea, absoluteX, absoluteY){
        var pageOffset = drawingArea.offset();
        
        return {
            x:  absoluteX - pageOffset.left,
            y: absoluteY - pageOffset.top
        };
    }
    
    wwp.initializeDrawingArea = function(drawingAreaElement){
        var start = null;
        var isDragging = false;
        var drawingArea = $(drawingAreaElement);      

        paper = new Raphael(drawingAreaElement);
        
        $(document).mousedown(function(event) {
            isDragging = true;
            start = relativeOffset(drawingArea, event.pageX, event.pageY);
        });
        
        $(document).mouseup(function(event) {
            isDragging = false;
        });
        
        drawingArea.mousemove(function(event){
            var pageOffset = drawingArea.offset();
            var end = relativeOffset(drawingArea, event.pageX, event.pageY);
            
            if(start !== null && isDragging) wwp.drawLine(start.x, start.y, end.x, end.y);
            start = end;
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