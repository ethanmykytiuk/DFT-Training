/*global desc, task, jake, fail, complete, directory */
(function() {
    "use strict";

    var GENERATED_DIR = "generated";
    var TEMP_TESTFILE_DIR = GENERATED_DIR + "/test";
    var KARMA_PORT = 8080;
    var KARMA_CONFIG = "karma.conf.js";

    var lint = require("./build/lint/lint_runner.js");
    var nodeunit = require("nodeunit").reporters["default"];

    directory(TEMP_TESTFILE_DIR);

    desc("Delete all generated files");
    task("clean", [], function() {
       jake.rmRf(GENERATED_DIR); 
    });

    /***** HELPER FUNCTIONS  ******/
    function globalLintOptions() {
		var options = {
			bitwise:true,
			curly:false,
			eqeqeq:true,
			forin:true,
			immed:true,
			latedef:true,
			newcap:true,
			noarg:true,
			noempty:true,
			nonew:true,
			regexp:true,
			undef:true,
			strict:true,
			trailing:true
		};
		return options;
	}
    
    function nodeLintOptions() {
		var options = globalLintOptions();
		options.node = true;
		return options;
	}

	function browserLintOptions() {
		var options = globalLintOptions();
		options.browser = true;
		return options;
	}
    
    function testFiles(){
        var testFiles = new jake.FileList();
        testFiles.include("**/_*_test.js");
        testFiles.exclude("node_modules"); 
		testFiles.exclude("./src/client/**");
        return testFiles.toArray();
    }
	
    function nodeFiles(){
        var javascriptFiles = new jake.FileList();
        javascriptFiles.include("**/*.js");
        javascriptFiles.exclude("node_modules");
        javascriptFiles.exclude("build");
        javascriptFiles.exclude("spikes");
        javascriptFiles.exclude("karma.conf.js"); 
        javascriptFiles.exclude("src/client"); 
        javascriptFiles.exclude("./vendor_client/*.js");
        return javascriptFiles.toArray();
    }
            
    function clientFiles(){
        var javascriptFiles = new jake.FileList();
        javascriptFiles.include("src/client/*.js");
        //javascriptFiles.exclude("./vendor_client/*.js");
        return javascriptFiles.toArray();
    }
    
    function sh(command, errorMessage, callback) {
		console.log("> " + command);

		var stdout = "";
		var process = jake.createExec(command, {printStdout:true, printStderr: true});
		process.on("stdout", function(chunk) {
			stdout += chunk;
		});
		process.on("error", function() {
			fail(errorMessage);
		});
		process.on("cmdEnd", function() {
			callback(stdout);
		});
		process.run();
    }
    
    /***********/
    
    
    /***** MAIN TESTS ******/   
    
    desc("Build and Test");
    task("default", ["lint", "test"], function(){
        console.log("\n\n ALL PASSED");
    });

    desc("Lint everything");
    task("lint", ["lintNode", "lintClient"]);

    desc("Lint Node");
    task("lintNode", ["nodeVersion"], function() {
        var passed = lint.validateFileList(nodeFiles(), nodeLintOptions(), {});
        if(!passed)  fail("Lint Node failed");
    });

    desc("Lint Client");
    task("lintClient", function(){
        var passed = lint.validateFileList(clientFiles(), browserLintOptions(), {});
        if(!passed)  fail("Lint Client failed");
    });

    desc("Test everything");
	task("test", ["testNode", "testClient"]);

    desc("Test server");
    task("testNode", ["nodeVersion", TEMP_TESTFILE_DIR], function() {
        
        nodeunit.run(testFiles(), null, function(failures) {
             if(failures) fail("Tests failed");
             complete();
        });
    }, {async: true});

    desc("Test client code");
	task("testClient", function() {
        var runner = require('karma').runner;
		runner.run({
			port: KARMA_PORT,
			strict: !process.env.loose
		}, complete, fail);
	}, { async: true });

    /***********/


    /***** TASKS ******/
	desc("Deploy to Heroku");
	task("deploy", ["default"], function() {
		console.log("1. Make sure 'git status' is clean.");
		console.log("2. 'git push heroku master'");
		console.log("3. 'jake test'");
	});

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

     //	desc("Ensure correct version of Node is present");
    task("nodeVersion", [], function() {  
        var NODE_VERSION = "v8.3.0\n";

        sh("node --version", "Node not installed", function(stdout) {
            //console.log("abc "+stdout);
            //console.log("def "+NODE_VERSION)
            //if (stdout !== NODE_VERSION) fail("Incorrect node version. Expected " + NODE_VERSION);
            complete();
        });
    }, {async: true});

    
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
    
}());