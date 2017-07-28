module.exports = function(grunt) {
	var gtx = require('gruntfile-gtx').wrap(grunt);

    gtx.loadAuto();

    var gruntConfig = require('./grunt');
    gruntConfig.package = require('./package.json');

    gtx.config(gruntConfig);

    // We need our bower components in order to develop
    gtx.alias('build:angular', [
        'recess:less', 
        'clean:angular',
        'clean:dist',
        'copy:libs', 
        'copy:angular', 
        'useminPrepare', 
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'usemin',
        'copy:dist',
        'clean:angular',
        'clean:tmp'
    ]);

    gtx.alias('default', ['build:angular']);

    gtx.finalise();
}
