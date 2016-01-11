/**
 * Gerenciador de tarefas de desenvolvimento
 */
'use strict';

var gulp = require('gulp'),
  apidoc = require('gulp-apidoc');

gulp.task('default', function () {
  // place code for your default task here
});

/**
 * Gera a documentação da api
 */
gulp.task('apidoc', function(done){
  apidoc({
    src: "routes/",
    dest: "doc/",
    debug: true
  },done);
});
