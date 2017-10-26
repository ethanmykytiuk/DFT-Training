/*global dump, $, Raphael, wwp:true*/

wwp = {};

(function() {
	"use strict";
       
    var paper;
    
    wwp.initializeDrawingArea = function(drawingAreaElement){
        var startX = null;
        var startY = null;
        var isDragging = false;
        
        paper = new Raphael(drawingAreaElement);
        
        $(document).mousedown(function(event) {
            isDragging = true;
            var pageOffset = drawingArea.offset();

            startX = event.pageX - pageOffset.left;
            startY = event.pageY - pageOffset.top;
        });
        
        $(document).mouseup(function(event) {
				isDragging = false;
        });
        
        var drawingArea = $(drawingAreaElement);      
        drawingArea.mousemove(function(event){
            var pageOffset = drawingArea.offset();
            var endX = event.pageX - pageOffset.left;
            var endY = event.pageY - pageOffset.top;
            
            if(startX !== null && isDragging) wwp.drawLine(startX, startY, endX, endY);
            
            startX = endX;
            startY = endY;
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