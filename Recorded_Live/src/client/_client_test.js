/*global describe, it, expect, dump, wwp*/

// Expect = assertion library
// Mocha = test framework

(function() {

    "use strict";
    
    describe("Nothing", function() {

        it("should run", function() {
            
            wwp.createElement();
            
            var extractedDiv = document.getElementById("tdjs");
            expect(extractedDiv.getAttribute("foo")).to.equal("bar");
        });

    });
    
}());