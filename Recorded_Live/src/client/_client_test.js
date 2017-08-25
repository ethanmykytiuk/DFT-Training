/*global describe, it, expect, dump*/

// Expect = assertion library
// Mocha = test framework

(function() {

    "use strict";
    
    describe("Nothing", function() {

        it("should run", function() {
            var extractedDiv = document.getElementById("tdjs");
            expect(extractedDiv.getAttribute("foo")).to.equal("bar");
        });

    });
    
}());