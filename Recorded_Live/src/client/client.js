/*global dump, $, Raphael, wwp:true*/

wwp = {};

(function() {
	"use strict";
       
    var paper;
    
    function relativeOffset(drawingArea, pageX, pageY){
        var pageOffset = drawingArea.offset();
        
        return {
            x: pageX - pageOffset.left,
            y: pageY - pageOffset.top
        };
    }
    
    function drawLine(startX, startY, endX, endY) {
        paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
    }
    
    function isWithinDrawingArea(offset){
        if(offset.x >= 0 && offset.x <= paper.width &&
           offset.y >= 0 && offset.y <= paper.height){
            return true;
        }
        return false;
    }
    
    function handleDragEvents(drawingAreaElement){
        var start = null;
        var drawingArea = $(drawingAreaElement);      

        $(document).mousedown(function(event) {
            var offset = relativeOffset(drawingArea, event.pageX, event.pageY);
            if(isWithinDrawingArea(offset)){
                start = offset;
            }
        });
                       
        $(document).mousemove(function(event){
            if(start === null) return;
            
            var end = relativeOffset(drawingArea, event.pageX, event.pageY);
            
            if(isWithinDrawingArea(end)){
                drawLine(start.x, start.y, end.x, end.y);
                start = end;
            } else {
                start = null;
            }
        }); 
        
        $(document).mouseup(function(event) {
            start = null;
        });
    }
    
    wwp.initializeDrawingArea = function(drawingAreaElement){
        handleDragEvents(drawingAreaElement);
        paper = new Raphael(drawingAreaElement);
        return paper;
    };
	
}());