module.exports = (config) => {
    config
        .addPassthroughCopy('js')
        .addPassthroughCopy('css')
        .addPassthroughCopy('img')
        .addPassthroughCopy('wp-content')
        .addPassthroughCopy('txt')
        .addPassthroughCopy('zoznamy');

    config.addLiquidFilter('skDate', function(date) {
        return `${date.getMonth()+1}.${date.getDate()}.${date.getFullYear()}`;
    });

    config.addLiquidFilter('readingTime', function(postOrString) {
        const speed = 200;
        const htmlContent =
            typeof postOrString === 'string' ?
            postOrString :
            postOrString.templateContent;

        if (!htmlContent) {
            return '0';
        }
        const matches = htmlContent.replace(/(<([^>]+)>)/gi, '').match(/[\u0400-\u04FF]+|\S+\s*/g);
        return '' + Math.ceil((matches.length || 0) / speed);
    });

    config.addFilter("head", (array, n) => {
        return n < 0 ? array.slice(n) : array.slice(0, n);
    });

    return {
        htmlTemplateEngine: "liquid",
    };
}