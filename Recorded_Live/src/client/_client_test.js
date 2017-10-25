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

        // no longer needed?
		function svgPathFor(element) {
			var path = element.node.attributes.d.value;
			if (path.indexOf(",") !== -1) {
				// We're in Firefox, Safari, Chrome, which uses format: M20,30L30,300
				return path;
			}
			else {
				// We're in IE9, which uses format: M 20 30 L 30 300
				var ie9PathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
				var ie9 = path.match(ie9PathRegex);

				return "M" + ie9[1] + "," + ie9[2] + "L" + ie9[3] + "," + ie9[4];
			}
			return path;
		}
        
        // no longer needed?
		function vmlPathFor(element) {
			// We're in IE 8, which uses format: m432000,648000 l648000,67456800 e
			var VML_MAGIC_NUMBER = 21600;

			var path = element.node.path.value;

			var ie8PathRegex = /m(\d+),(\d+) l(\d+),(\d+) e/;
			var ie8 = path.match(ie8PathRegex);

			var startX = ie8[1] / VML_MAGIC_NUMBER;
			var startY = ie8[2] / VML_MAGIC_NUMBER;
			var endX = ie8[3] / VML_MAGIC_NUMBER;
			var endY = ie8[4] / VML_MAGIC_NUMBER;

			return "M" + startX + "," + startY + "L" + endX + "," + endY;
		}
    
        function pathFor(element) {
			
            var box = element.getBBox();
            return "M" + box.x + "," + box.y + "L" + box.x2 + "," + box.y2;
            
            // not needed because of elements BBox (bounding box)
            //if (Raphael.vml) return vmlPathFor(element);
			//else if (Raphael.svg) return svgPathFor(element);
			//else throw new Error("Unknown Raphael type");
		}
        
        function drawingElements(paper){
            var result = [];
            paper.forEach(function(element){
              result.push(element);
            });
            return result;
        }
        
		function clickMouse(relativeX, relativeY) {
			var topLeftOfDrawingArea = drawingArea.offset();
			var pageX = relativeX + topLeftOfDrawingArea.left;
			var pageY = relativeY + topLeftOfDrawingArea.top;

			var eventData = new jQuery.Event();
			eventData.pageX = pageX;
			eventData.pageY = pageY;
			eventData.type = "click";
			drawingArea.trigger(eventData);
		}

        it("should have the same dimensions as its enclosing div", function(){        
            drawingArea = $("<div style='height:200px; width: 400px;'></div>");
            $(document.body).append(drawingArea);
            paper = wwp.initializeDrawingArea(drawingArea[0]);
            
            expect(paper.height).to.equal(200);
            expect(paper.width).to.equal(400);
        });
        
        it("should draw a line", function(){
            drawingArea = $("<div style='height:200px; width: 400px;'></div>");
            $(document.body).append(drawingArea);
            paper = wwp.initializeDrawingArea(drawingArea[0]);
            
            wwp.drawLine(20,30,30,300);
            var elements = drawingElements(paper);
            expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.equal("M20,30L30,300");
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
        
        
		function paperPaths(paper) {
			var result = [];
			for (var i = 0; i < drawingElements(paper).length; i++) {
				var box = drawingElements(paper)[i].getBBox();
				result.push([ box.x, box.y, box.x2, box.y2 ]);
			}
			return result;
		}

        
        it("respond to the mouse", function(){
            drawingArea = $("<div style='height:200px; width: 400px;'></div>");
            $(document.body).append(drawingArea);
            paper = wwp.initializeDrawingArea(drawingArea[0]);

			clickMouse(20, 30);
			clickMouse(50, 60);
			//clickMouse(40, 20);

			expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60]]);//, [50, 60, 40, 20] ]);
        });
        
        
    });
    
        
    
    
}());