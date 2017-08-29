/*global describe, it, expect, dump, $, wwp, afterEach*/

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
            
            //verify it was initialized properly
            var tagName = $(drawingDiv).children()[0].tagName.toLowerCase();
                        
            if(tagName === "svg"){
                // In browser that supports SVG
                expect(tagName).to.equal("svg");        
            }
            else
            {
                // In browser that doesn't support SVG (IE 8)
                expect(tagName).to.equal("div");  
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