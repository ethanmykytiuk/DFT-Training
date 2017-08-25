/*global describe, it, expect, dump, wwp*/

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
            
            //initialize
            wwp.initializeDrawingArea();
            
            //verify it's been created
            var extractedDiv = document.getElementById("wwp-drawingArea");
            expect(extractedDiv).to.be.ok();
        });

    });
    
}());