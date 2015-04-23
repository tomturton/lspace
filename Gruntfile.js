module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        cssmin: {
            build: {
                src: 'dist/lspace.styles.css',
                dest: 'dist/lspace.styles.min.css'
            }
        },


        jshint: {
            options: {
                curly: true
            },
            dev: {
                src: [
                    'dist/lspace.jquery.js'
                ]
            }
        },


        uglify: {
            dist: {
                src: 'dist/lspace.jquery.js',
                dest: 'dist/lspace.jquery.min.js'
            }
        },


        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            styles: {
                files: ['dist/lspace.styles.css'],
                tasks: ['cssmin']
            },
            scripts: {
                files: ['dist/lspace.jquery.js'],
                tasks: ['jshint', 'uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['cssmin', 'jshint', 'uglify']);
};
