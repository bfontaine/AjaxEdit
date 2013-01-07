var cwd = process.cwd();

desc( 'test the plugin' );
task( 'test', { async: true }, function() {

    jake.exec([ 'phantomjs ./run-qunit.js test/index.html' ], function() {

        complete();

    }, { printStdout: true, printStderr: true });

})
