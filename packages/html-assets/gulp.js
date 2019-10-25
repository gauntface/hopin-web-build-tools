const gulp = require('gulp');

gulp.task('build', gulp.series(
    () => Promise.resolve().then(() => console.log('TODO: Build TS'))
));