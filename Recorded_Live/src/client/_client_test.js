/*global describe, it, expect, dump, $, wwp, afterEach, Raphael*/

// Expect = assertion library
// Mocha = test framework

(function() {

    "use strict";
    
    var drawingDiv;
    
    describe("Drawing area", function() {

        afterEach(function() {
            drawingDiv.remove();
        });

		function svgPathFor(element) {
			var path = element.node.attributes.d.value;
			if (path.indexOf(",") !== -1) {
				// We're in Firefox, Safari, Chrome, which uses format
				// M20,30L30,300
				return path;
			}
			else {
				// We're in IE9, which uses format
				// M 20 30 L 30 300
				var ie9PathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
				var ie9 = path.match(ie9PathRegex);

				return "M" + ie9[1] + "," + ie9[2] + "L" + ie9[3] + "," + ie9[4];
			}
			return path;
		}

		function vmlPathFor(element) {
			// We're in IE 8, which uses format
			// m432000,648000 l648000,67456800 e
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
			if (Raphael.vml) return vmlPathFor(element);
			else if (Raphael.svg) return svgPathFor(element);
			else throw new Error("Unknown Raphael type");
		}
        
        it("should be initialized in predefined div", function() {
            drawingDiv = $("<div></div>");            
            $(document.body).append(drawingDiv);
            
            wwp.initializeDrawingArea(drawingDiv[0]);
            var tagName = $(drawingDiv).children()[0].tagName.toLowerCase();

            if(Raphael.type === "SVG") {
                expect(tagName).to.equal("svg");        
            }
            else if(Raphael.type === "VML") {
                expect(tagName).to.equal("div");  
            } else {
                expect().fail("Browser does not support Raphael");
            }
             
        });

        
        it("should have the same dimensions as its enclosing div", function(){        
            drawingDiv = $("<div style='height:200px; width: 400px;'></div>");            
            $(document.body).append(drawingDiv);

            var paper = wwp.initializeDrawingArea(drawingDiv[0]);
            expect(paper.height).to.equal(200);
            expect(paper.width).to.equal(400);
        });
        
        it("should draw a line", function(){
            drawingDiv = $("<div style='height:200px; width: 400px;'></div>");
            $(document.body).append(drawingDiv);

            var paper = wwp.initializeDrawingArea(drawingDiv[0]);
            wwp.drawLine(20,30,30,300);
            
            var elements = [];
            paper.forEach(function(element){
              elements.push(element);
            });
            
            expect(elements.length).to.equal(1);
            
            var element = elements[0];
			var path = pathFor(element);
            expect(path).to.equal("M20,30L30,300");
        });
        
        
    });
    
        
    
    
}());