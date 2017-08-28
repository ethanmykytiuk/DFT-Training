/*global describe, it, expect, dump, $, wwp*/

// Expect = assertion library
// Mocha = test framework

(function() {

    "use strict";
    
    describe("Drawing area", function() {

        it("should be initialized in predefined div", function() {
            
            // create div (assumed to be on homepage)
            var div = document.createElement("div");
            div.setAttribute("id", "wwp-drawingArea");
            document.body.appendChild(div);
            
            //initialize it
            wwp.initializeDrawingArea("wwp-drawingArea");
            
            //verify it was initialized properly
            var tagName = $(div).children()[0].tagName.toLowerCase();
                        
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

    });
    
}());