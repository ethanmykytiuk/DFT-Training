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
            var tagName = $(div).children()[0].tagName;
            expect(tagName).to.equal("svg");
            dump($(div).children()[0].tagName);
        });

    });
    
}());