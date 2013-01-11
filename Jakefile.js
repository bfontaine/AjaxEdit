var cwd = process.cwd();

desc( 'test the plugin' );
task( 'test', { async: true }, function() {

    jake.exec([ 'mocha-phantomjs test/index.html' ], function() {

        complete();

    }, { printStdout: true, printStderr: true });

})
