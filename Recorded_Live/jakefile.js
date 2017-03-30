/*global desc, task, jake, fail, complete */
"use strict";

function nodeLintOptions() {
    return {
        bitwise: true,
        curly: false,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        regexp: true,
        undef: true,
        strict: true,
        trailing: true,
        node: true
    };
}

(function() {
    desc("Build and Test");
	task("default", ["lint", "test"]);

	desc("Lint everything");
	task("lint", [], function() {
		var lint = require("./build/lint/lint_runner.js");

		var files = new jake.FileList();
		files.include("**/*.js");
		files.exclude("node_modules");
        files.exclude("build");
        files.exclude("spikes");
		var options = nodeLintOptions();
		var passed = lint.validateFileList(files.toArray(), options, {});
        if(!passed)  fail("Lint failed");
	});
}());

desc("Test everything");
task("test", [], function() {
     var reporter = require("nodeunit").reporters["default"];
     reporter.run(['src/server/_server_test.js'], null, function(failures) {
         if(failures) fail("Tests failed");
         complete();
    });
}, {async: true});

desc("Integrate");
task("integrate", ["default"],function() {
    console.log("1. Make sure git status is clean");
    console.log("2. Build on the integration box.");
    console.log("  'a. git pull'");
    console.log("  'b. jake'");
    console.log("   c. if jake fails, stop! start over and try again");
    console.log("3. 'git checkout integration'");
    console.log("4. 'git merge master --no-ff --log'");
    console.log("5. 'git checkout master'");
});


/*       Older things left in for reference    */
//Lesson One
// Example on how to set up auto build with a dependency
desc("example");
task("example", ["dependency"], function(){ 
    console.log("Example Task");
});

desc("dependency");
task("dependency", function(){
    console.log("dependency");
});