var _ = require('lodash');
var detectVersion = require('./detect');

// Convert a summary tree into a flatten list of chapters
function summaryToChaptersList(summary) {
    var out = [];

    function pushChapter(article) {
        if (!article.title) return;
        if (out.length > 0) {
            out[out.length -1].next = {
                "path": article.path,
                "title": article.title,
                "level": article.level,
                "exists": Boolean(article.path),
                "external": Boolean(article.path),
                "introduction": false
            };
        }

        out.push({
            "index": out.length,
            "title": article.title,
            "introduction": out.length == 0,
            "next": null,
            "level": article.level,
            "path": article.path,
            "percent": 0,
            "done": Boolean(article.path)
        });
    }

    function pushChapters(articles) {
        _.each(articles, function(article) {
            pushChapter(article);
            if (article.articles) pushChapters(article.articles);
        });
    }

    pushChapters(summary.parts);

    return out;
}

// Convert to a GitBook v2 format
function toVersion1(json) {
    if (detectVersion(json) == 1) return json;

    var output = {};

    // Content as sections
    output.sections = [
        {
            type: 'normal',
            content: json.page.content
        }
    ];

    // Summary as progress
    output.progress = {
        chapters: summaryToChaptersList(json.summary),
        percent: 0,
        prevPercent: 0
    };

    // Current chapter
    var current = _.find(output.progress.chapters, {
        path: json.file.path
    });
    output.progress.current = current;
    if (current) {
        output.progress.percent = (current.index*100)/output.progress.chapters.length;
        output.progress.prevPercent = (Math.max(0, current.index - 1)*100)/output.progress.chapters.length;
    }

    return output;
}

module.exports = toVersion1;
