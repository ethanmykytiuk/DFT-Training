/*global describe, it, expect*/

// Expect = assertion library
// Mocha = test framework

(function() {

    "use strict";
    
    describe("Nothing", function() {

        it("should run", function() {
            expect("foo").to.equal("foo");
        });

    });
    
}());