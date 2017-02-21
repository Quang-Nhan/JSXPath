module.exports = function(grunt) {
  grunt.initConfig({
    jasmine_node: {
      task_name: {
        options: {
          forceExit: true,
          coverage: {
            includeAllSources: false
          },
          jasmine: {
            spec_dir: 'src',
            spec_files: [
              '**/*.spec.js'
            ]
          }
        },
        src: ['src/**/!(*spec).js']
      }
    },
    exec: {
      md_readme: {
        cmd: 'illuminate < src/JSXPath.js > README.md'
      },
      md_axis: {
        cmd: 'illuminate < src/Tokens/JSXAxisTokens.js > md/AXIS.md'
      },
      md_functions: {
        cmd: 'illuminate < src/Tokens/JSXPathFunctions.js > md/FUNCTIONS.md'
      },
      // md_nodeselection: {
      //   cmd: 'illuminate < src/Tokens/JSXAxisTokens.js > md/AXIS.md'
      // },
      md_operators: {
        cmd: 'illuminate < src/Tokens/JSXOperatorTokens.js > md/OPERATORS.md'
      },
      md_help: {
        cmd: 'illuminate -h'
      },
      html_readme: {
        cmd: 'illuminate --breaks --syntax --pedantic --smartypants --html < src/JSXPath.js > README.html'
      },
      html_axis: {
        cmd: 'illuminate --breaks --syntax --pedantic --smartypants --html < src/Tokens/JSXAxisTokens.js > md/AXIS.html'
      },
      html_functions: {
        cmd: 'illuminate --breaks --syntax --pedantic --smartypants --html < src/Tokens/JSXPathFunctions.js > md/FUNCTIONS.html'
      },
      // html_nodeselection: {
      //   cmd: 'illuminate --breaks --syntax --pedantic --smartypants --html < src/Tokens/JSXAxisTokens.js > md/AXIS.html'
      // },
      html_operators: {
        cmd: 'illuminate --breaks --syntax --pedantic --smartypants --html < src/Tokens/JSXOperatorTokens.js > md/OPERATORS.html'
      },
      docs_generate: {
        cmd: 'cd src && yuidoc .'
      },
      docs_server: {
        cmd: 'yuidoc src --server'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node-coverage');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['jasmine_node', 'docs']);
  grunt.registerTask('markdown', ['exec:md_readme', 'exec:md_axis', 'exec:md_functions', 'exec:md_operators']);
  grunt.registerTask('mdhtml', ['exec:html_readme', 'exec:html_axis', 'exec:html_functions', 'exec:html_operators']);
  grunt.registerTask('md', ['markdown', 'mdhtml']);
  grunt.registerTask('docs', 'exec:docs_generate');
  grunt.registerTask('docwatch', 'exec:docs_server');
}