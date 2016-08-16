module.exports = function (config) {
    config.set({
        basePath: '../',

        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/moment/min/moment.min.js',

            'node_modules/angular/angular.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-aria/angular-aria.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-route/angular-route.js',
            'node_modules/angular-material/angular-material.js',
            'node_modules/angular-moment/angular-moment.js',
	        'node_modules/angular-websocket/dist/angular-websocket.min.js',

            'app/src/**/*.js',
            'test/unit/**/*.spec.js'
        ],

        logLevel: config.LOG_ERROR,
        port: 9876,
        reporters: ['progress'],
        colors: true,

        autoWatch: false,
        singleRun: true,

        // For TDD mode
        //autoWatch : true,
        //singleRun : false,

        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        plugins: ['karma-chrome-launcher', 'karma-jasmine']

    });
};
