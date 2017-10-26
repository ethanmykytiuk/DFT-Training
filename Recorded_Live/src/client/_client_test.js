/*global describe, jQuery, it, expect, dump, $, wwp, afterEach, beforeEach, Raphael*/

// Expect = assertion library
// Mocha = test framework

(function() {

    "use strict";
    
    var drawingArea;
    var paper;
    
    describe("Drawing area", function() {
    
        afterEach(function() {
            drawingArea.remove();
        });

		function svgPathFor(element) {
            var pathRegex;
			var path = element.node.attributes.d.value;
            
			if (path.indexOf(",") !== -1) {
				// We're in Firefox, Safari, Chrome, which uses format "M20,30L30,300"
                pathRegex = /M(\d+),(\d+)L(\d+),(\d+)/;
			}
			else {
				// We're in IE9, which uses format "M 20 30 L 30 300"
				pathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
			}
            var pathComponents = path.match(pathRegex);
            
            return [
                pathComponents[1],
                pathComponents[2],
                pathComponents[3],
                pathComponents[4]
            ];
		}

		function vmlPathFor(element) {
			// We're in IE 8, which uses format "m432000,648000 l648000,67456800 e"
			var VML_MAGIC_NUMBER = 21600;

			var path = element.node.path.value;

			var ie8PathRegex = /m(\d+),(\d+) l(\d+),(\d+) e/;
			var ie8 = path.match(ie8PathRegex);

			var startX = ie8[1] / VML_MAGIC_NUMBER;
			var startY = ie8[2] / VML_MAGIC_NUMBER;
			var endX = ie8[3] / VML_MAGIC_NUMBER;
			var endY = ie8[4] / VML_MAGIC_NUMBER;

			return [
				startX,
				startY,
				endX,
				endY
			];
		}
    
        function pathFor(element) {
//			var box = element.getBBox();
//			return "M" + box.x + "," + box.y + "L" + box.x2 + "," + box.y2;

			if (Raphael.vml) return vmlPathFor(element);
			else if (Raphael.svg) return svgPathFor(element);
			else throw new Error("Unknown Raphael type");
		}
                
        function paperPaths(paper) {
			var result = [];            
            paper.forEach(function(element){
                result.push(pathFor(element));
            });
            
			return result;
		}
        
        function pageOffset(drawingArea, relativeX, relativeY){
            var topLeftOfDrawingArea = drawingArea.offset();            
            return {
              x: relativeX + topLeftOfDrawingArea.left,
              y: relativeY + topLeftOfDrawingArea.top
            };
        }
        
        function createEvent(page, eventType){
            var eventData = new jQuery.Event();
			eventData.pageX = page.x;
			eventData.pageY = page.y;
			eventData.type = eventType;
            return eventData;
        }

        function mouseDown(relativeX, relativeY) {
            var page = pageOffset(drawingArea, relativeX, relativeY);
            var eventData = createEvent(page, "mousedown");
			drawingArea.trigger(eventData);
		}

		function mouseMove(relativeX, relativeY) {
            var page = pageOffset(drawingArea, relativeX, relativeY);
            var eventData = createEvent(page, "mousemove");
			drawingArea.trigger(eventData);
		}

		function mouseUp(relativeX, relativeY) {            
            var page = pageOffset(drawingArea, relativeX, relativeY);
            var eventData = createEvent(page, "mouseup");
			drawingArea.trigger(eventData);            
		}

        it("should have the same dimensions as its enclosing div", function(){        
            drawingArea = $("<div style='height:200px; width: 400px;'></div>");
            $(document.body).append(drawingArea);
            paper = wwp.initializeDrawingArea(drawingArea[0]);
            
            expect(paper.height).to.equal(200);
            expect(paper.width).to.equal(400);
        });
        
        it("draws a line in response to mouse drag", function(){
            drawingArea = $("<div style='height: 300px; width: 600px'>hi</div>");
			$(document.body).append(drawingArea);
			paper = wwp.initializeDrawingArea(drawingArea[0]);

			mouseDown(20, 30);
			mouseMove(50, 60);

			expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60] ]);
        });
        
		it("does not draw line segments when mouse is not down", function() {
			drawingArea = $("<div style='height: 300px; width: 600px'>hi</div>");
			$(document.body).append(drawingArea);
			paper = wwp.initializeDrawingArea(drawingArea[0]);

            mouseMove(20, 30);
			mouseMove(50, 60);
            
            expect(paperPaths(paper)).to.eql([]);
		});
        
        it("stops drawing line segments when mouse is up", function(){
            drawingArea = $("<div style='height: 300px; width: 600px'>hi</div>");
			$(document.body).append(drawingArea);
			paper = wwp.initializeDrawingArea(drawingArea[0]);

			mouseDown(20, 30);
			mouseMove(50, 60);
			mouseUp(50, 60);
			mouseMove(10, 15);

			expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60] ]);
       });
        
        it("draws multiple line segments when mouse is dragged multiple places", function(){
            drawingArea = $("<div style='height: 300px; width: 600px'>hi</div>");
			$(document.body).append(drawingArea);
			paper = wwp.initializeDrawingArea(drawingArea[0]);

			mouseDown(20, 30);
			mouseMove(50, 60);
			mouseMove(40, 20);
			mouseMove(10, 15);

			expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20], [40, 20, 10, 15] ]);
       });
        
        it("draws multiple line segments when there are multiple drags", function(){
            drawingArea = $("<div style='height: 300px; width: 600px'>hi</div>");
			$(document.body).append(drawingArea);
			paper = wwp.initializeDrawingArea(drawingArea[0]);

			mouseDown(20, 30);
			mouseMove(50, 60);
            mouseUp(50,60);
			
            mouseMove(40, 20);
            
            mouseDown(30,25);
			mouseMove(10, 15);
			mouseUp(10, 15);

			expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60], [30, 25, 10, 15] ]);
       });
        
        it("does not draw line segment in response to mouseup event", function(){
            drawingArea = $("<div style='height: 300px; width: 600px'>hi</div>");
			$(document.body).append(drawingArea);
			paper = wwp.initializeDrawingArea(drawingArea[0]);

			mouseDown(20, 30);
            mouseUp(50,60);
            
            expect(paperPaths(paper)).to.eql([]);
        });
        
 /*   WILL RETURN TO THIS    
		it("considers border when calculating mouse target", function() {
			drawingArea = $("<div style='height: 200px; width: 400px; border-width: 13px'></div>");
			$(document.body).append(drawingArea);
			paper = wwp.initializeDrawingArea(drawingArea[0]);

			var eventData = new jQuery.Event();
			eventData.pageX = 20;
			eventData.pageY = 30;
			eventData.type = "click";

			drawingArea.trigger(eventData);

			var topLeftOfDrawingArea = drawingArea.offset();
			var borderWidth = 13;
			var expectedX = 20 - topLeftOfDrawingArea.left - borderWidth;
			var expectedY = 30 - topLeftOfDrawingArea.top - borderWidth;

			var elements = drawingElements(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.equal("M0,0L" + expectedX + "," + expectedY);
		});
        */
        //TODO: test that em is converted to px
        
        
    });
    
        
    
    
}());