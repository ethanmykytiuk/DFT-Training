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
        var drawingArea = $(drawingAreaElement);      

        paper = new Raphael(drawingAreaElement);
        
        $(document).mousedown(function(event) {
            start = relativeOffset(drawingArea, event.pageX, event.pageY);
        });
        
        $(document).mouseup(function(event) {
            start = null;
        });
        
        drawingArea.mousemove(function(event){
            
            if(start === null) return;

            var end = relativeOffset(drawingArea, event.pageX, event.pageY);
            
            if(start !== null) wwp.drawLine(start.x, start.y, end.x, end.y);
            start = end;
        });  
       
        return paper;
    };
    
    wwp.drawLine = function(startX, startY, endX, endY) {
			paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
		};
	
}());