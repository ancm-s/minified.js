/*
 * Welcome to Minfied's gruntfile :)
 * 
 * Here are some tasks that may be interesting for development:
 * 
 * - all: compiles and tests everything, sets up the /WebContent dir that's used for the site
 * - code: compiles the code in /src, executes automated tests
 * - test: runs all available tests (util in Node.js, web in PhantomJS)
 * - testQuick: runs the most important tests, much faster than 'test'
 * - site: use after you changed site content in /srcContent
 * - assemble (default): just create minified.js and copy test cases into /WebDevelopment, but no (slow) closure compilation
 * - watch: watches over files, execute the tasks above automatically when files change
 * - server: starts a server on port 8080 that serves /WebContent
 * 
 */ 

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		minitemplate: {
			staticPages: {
				options: {
					template: 'templates/page.template'
				},
				files: [{
			            expand: true,     
			            cwd: 'srcContent/',  
			            src: ['**/*.hson'],
			            dest: 'WebContent/',
			            ext: '.html'
			          
				}]
			},
			webTests: {
				options: {
					template: 'src/test-web/webtest.template'
				},
				files: [{
			            expand: true,     
			            cwd: 'src/test-web/',  
			            src: ['**/*.hson'],
			            dest: 'WebContent/test/',
			            ext: '.html'
			          
				}]
			}
		},
		
		writedocs: {
		    web: {
		      options: {  
		        destDir: 'srcContent/api/'
		      },
		      files: {
		    	  src: ['src/minified-generated-full-src.js']
		      }
		    }
		},
		
		mergesrc: {
		    main: {
		      options: {
		    	  prolog: "\n\n// WARNING! This file is autogenerated from minified-master.js and others.\n\n\n"
		      },
		      files: {
		    	  'src/minified-generated-full-src.js': ['src/minified-master.js', 
		    	                                         'src/minified-web-full-src.js', 
		    	                                         'src/minified-util-full-src.js',
		    	                                         'src/minified-extras-full-src.js']
		      }
		    }
		},
		
		rebuildsrc: {
			normal: {
				options: {
					config: "// minified.js config start -- use this comment to re-create your build configuration\n"+
					 "// - All sections except debug, ie6compatibility, ie7compatibility, ie8compatibility.\n"
				},
				files: {
					'dist/minified-src.js':     'src/minified-generated-full-src.js',
					'dist/minified-web-src.js': 'src/minified-web-full-src.js'
				}
			},
			legacy: {
				options: {
					config: "// minified.js config start -- use this comment to re-create your build configuration\n"+
					 "// - All sections except debug.\n"
				},
				files: {
					'dist/minified-legacyie-src.js'    : 'src/minified-generated-full-src.js',
					'dist/minified-legacyie-web-src.js': 'src/minified-web-full-src.js',
					'dist/minified-util-src.js':         'src/minified-util-full-src.js'
				}
			},
			headless: {
				options: {
					config: "// minified.js config start -- use this comment to re-create your build configuration\n"+
					"// - All sections except ie6compatibility, ie7compatibility, ie8compatibility, ie9compatibility, amdfallback.\n",
					extraOptions: ['commonjs']
				},
				files: {
					'dist/minified-headless.js': 'src/minified-util-full-src.js',
				}
			}
		},
		
		htmlmin: {
		    dist: {
		      options: {  
		        removeComments: true,
		      },
		      files: [{
		            expand: true,     
		            cwd: 'WebContent/',  
		            src: ['*.html', 'about/*.html', 'api/**/*.html', 'builder/*.html', 'docs/**/*.html', 'download/*.html'],
		            dest: 'WebContent/'		          
		      }]
		    }
		},
		
		'closurecompiler': {
			dist: {
				options: {
					compilation_level: 'ADVANCED_OPTIMIZATIONS'
				},
				files: {
					'tmp/minified-web.js':          'dist/minified-web-src.js',
					'tmp/minified-util.js':         'dist/minified-util-src.js',
					'tmp/minified.js':              'dist/minified-src.js',
					'tmp/minified-legacyie.js':     'dist/minified-legacyie-src.js',
					'tmp/minified-legacyie-web.js': 'dist/minified-legacyie-web-src.js'
				}
			}
		},
		
		uglify: {
			dist: {
				options: {
					compress: {
						hoist_vars: true,
						unsafe: true
					},
					mangle: {
					}					
				},
				files: {
					'dist/minified.js':              'tmp/minified.js',
					'dist/minified-web.js':          'tmp/minified-web.js',
					'dist/minified-util.js':         'tmp/minified-util.js',
					'dist/minified-legacyie.js':     'tmp/minified-legacyie.js',
					'dist/minified-legacyie-web.js': 'tmp/minified-legacyie-web.js'
				}
			},
			
			site: {
				options: {
					compress: {
					},
					mangle: {
					}					
				},
				files: {
					'WebContent/js/builder.js': ['dist/minified-src.js', 'srcContent/js/parser-src.js', 'srcContent/js/builder-src.js'],
					'WebContent/js/homepage.js': ['srcContent/js/minified-homepage.js', 'srcContent/js/homepage-src.js']
				}
			}
		},
		
		copy: {
			sources: {
				files: {
					'WebContent/builder/minified-generated-full-src.js': 'src/minified-generated-full-src.js',
					'WebContent/test/sparkplug.js': 'srcContent/js/sparkplug-src.js',
					'WebContent/test/mocha.js':     'node_modules/mocha/mocha.js',
					'WebContent/test/mocha.css':    'node_modules/mocha/mocha.css'
				}
			},
			imgs: {
				files: {
					'WebContent/img/': 'srcContent/img/*.png'
				}
			},
			test: {
				files: [{
		            expand: true,
		            cwd: 'srcContent/',
		            src: ['examples/*.html', 'test/**/*.js', 'test/**/*.html', 'test/**/*.txt'],
		            dest: 'WebContent/'
		      }]
			},
			testdist: {
				files: [{
		            expand: true,
		            cwd: 'dist/',
		            src: ['*.js'],
		            dest: 'WebContent/test/dist/'
		      }]
			},
			testCases: {
				files: [{
		            expand: true,
		            cwd: 'src/test-web',  
		            src: ['*.js'],
		            dest: 'WebContent/test/'
		      }]
			},
			buildersrc: {
				files: {
					'WebContent/js/parser-src.js':  'srcContent/js/parser-src.js',
					'WebContent/js/builder-src.js': 'srcContent/js/builder-src.js'
				}
			},
			dist: {
				files: [{
		            expand: true,
		            cwd: 'dist/',  
		            src: ['*.js'],
		            dest: 'WebContent/download/'
		      }]
			}
		},
		
		cssmin: {
			site: {
				files: {
					'WebContent/css/minimum.css': 'srcContent/css/minimum.css',
					'WebContent/css/doc.css': ['srcContent/css/minimum.css', 'srcContent/css/doc.css'],
					'WebContent/css/links.css': ['srcContent/css/minimum.css', 'srcContent/css/links.css'],
					'WebContent/css/homepage.css': ['srcContent/css/minimum.css', 'srcContent/css/homepage.css'],
					'WebContent/css/reference.css': ['srcContent/css/minimum.css', 'srcContent/css/doc.css', 'srcContent/css/reference.css']
				}
			}
		},
		
		xmlmin: {
			site: {
			    files: [{
			            expand: true,     
			            cwd: 'srcContent/img',  
			            src: ['*.svg'],
			            dest: 'WebContent/img'		          
			    }]
			}
		},
		
		measuresize: {
			minified: {
				files: {
					'minified-web.js': 'dist/minified-web.js',
					'minified-util.js': 'dist/minified-util.js',
					'minified.js': 'dist/minified.js',
					'minified-legacyie-web.js': 'dist/minified-legacyie-web.js',
					'minified-legacyie.js': 'dist/minified-legacyie.js',
					'minified-src.js': 'dist/minified-src.js',
					'minified-legacyie-src.js': 'dist/minified-legacyie-src.js'
				}
			}
		},
		
		mochaTest: {
			util: {
				options: {
					bail: true,
				},
				src: [ 'src/test-util/*test.js' ]
			}
 	    },
 	    
 	    mocha: {
 	 		  quick: {
 	  			options: {
 	  				run: true,
 	  				timeout: 50000
 	  			},
 	  			src: [ 'WebContent/test/test-minified.html',  
 	  			       'WebContent/test/test-minified-legacy.html']
 	  		  },
 	 		  all: {
 	  			options: {
 	  				run: true,
 	  				timeout: 50000
 	  			},
 	  			src: [ 'WebContent/test/test-minified*.html' ]
 	  		  }

 	    },
 	    
		clean: {
			tmp: ['tmp'],
			webContent: ['WebContent'],
			dist: ['dist']
		},
		
		watch: {
			  test: {
				files: ['src/test-web/**/*'],
				tasks: ['assemble', 'testQuick']
			  },
			  code: {
				files: ['src/minified-web-full-src.js', 'src/minified-util-full-src.js', 'src/minified-extras-full-src.js', 'src/minified-master.js'],
				tasks: ['code']
			  },
			  content: {
			    files: ['srcContent/**/*', 'build/helper/docbuilder.js'],
			    tasks: ['site']
			  }
			},
		
		connect: {
		    server: {
		      options: {
		        port: 8080,
		        base: 'WebContent',
		        keepalive: true
		      }
		    }
		  }
	});
	
	grunt.loadTasks('build/tasks/');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-closurecompiler');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-xmlmin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('assemble', ['mergesrc', 'rebuildsrc', 'copy:sources', 'copy:test', 'copy:testCases', 'minitemplate:webTests']);
	grunt.registerTask('code', ['assemble', 'closurecompiler:dist', 'uglify', 'copy:testdist', 'testQuick', 'measuresize']);
	grunt.registerTask('testQuick', ['mochaTest', 'mocha:quick']);
	grunt.registerTask('test', ['mochaTest', 'mocha:all']);
	grunt.registerTask('site', ['uglify:site', 'writedocs', 'minitemplate', 'copy:imgs', 'copy:test', 'copy:buildersrc', 'cssmin', 'htmlmin', 'xmlmin', 'copy:dist']);
	grunt.registerTask('all', ['code', 'test', 'site']);
	grunt.registerTask('server', ['all', 'connect']);
	grunt.registerTask('default', ['code']);
	
	
};

