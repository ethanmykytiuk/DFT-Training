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
			var path = element.node.attributes.d.value;
			if (path.indexOf(",") !== -1) {
				// We're in Firefox, Safari, Chrome, which uses format "M20,30L30,300"
                var modernPathRegex = /M(\d+),(\d+)L(\d+),(\d+)/;
				var modern = path.match(modernPathRegex);

                return {
                    x: modern[1],
                    y: modern[2],
                    x2: modern[3],
                    y2: modern[4]
                };
			}
			else {
				// We're in IE9, which uses format "M 20 30 L 30 300"
				var ie9PathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
				var ie9 = path.match(ie9PathRegex);

                return {
                    x: ie9[1],
                    y: ie9[2],
                    x2: ie9[3],
                    y2: ie9[4]
                };
			}
			return path;
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

			return {
				x: startX,
				y: startY,
				x2: endX,
				y2: endY
			};
		}
    
        function pathFor(element) {
//			var box = element.getBBox();
//			return "M" + box.x + "," + box.y + "L" + box.x2 + "," + box.y2;

			if (Raphael.vml) return vmlPathFor(element);
			else if (Raphael.svg) return svgPathFor(element);
			else throw new Error("Unknown Raphael type");
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
            
			wwp.drawLine(20, 30, 30, 300);
			expect(paperPaths(paper)).to.eql([ [20, 30, 30, 300] ]);
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
			var box;
			var result = [];
			for (var i = 0; i < drawingElements(paper).length; i++) {
				box = pathFor(drawingElements(paper)[i]);
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
			clickMouse(40, 20);

			expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
        });
        
        
    });
    
        
    
    
}());