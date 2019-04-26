const fs = require('fs-extra');
const terser = require('terser');

async function minifyJS(logger, report, overrides) {
    const options = {
        warnings: true,
    };
    for (const f of report.srcFiles) {
        const buffer = await fs.readFile(f);
        const contents = buffer.toString();

        const minifyReport = terser.minify(contents, options);
        // Log any warnings the minify report found but carry on.
        if (minifyReport.warnings && minifyReport.warnings.length > 0) {
            logger.warn(`Minification returned ${minifyReport.warnings.length} warning(s):`);
            for (const w of minifyReport.warnings) {
                logger.warn(`  - ${w}`);
            }
        }

        // Log any errors from the minify report and throw and error.
        if (minifyReport.error) {
            logger.error(`Minification found an error:`);
            logger.error(minifyReport.error);
            throw new Error(`Minification returned an error. See logs for details.`);
        }

        await fs.writeFile(f, minifyReport.code);
    }
}

module.exports = {
    minifyJS
};