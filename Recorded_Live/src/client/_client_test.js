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
        
        function pathFor(element) {
			var path = element.node.attributes.d.value;
			if (path.indexOf(",") !== -1) {
				// We're in Firefox, Safari, Chrome, which uses format
				// M20,30L30,300
				return path;
			}
			else {
				// We're in IE9, which uses format
				// M 20 30 L 30 300
				var ie9Path = /M (\d+) (\d+) L (\d+) (\d+)/;
				var ie9 = path.match(ie9Path);

				return "M" + ie9[1] + "," + ie9[2] + "L" + ie9[3] + "," + ie9[4];
			}
			return path;
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