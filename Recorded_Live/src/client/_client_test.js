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
    
    });
    
        
    
    
}());