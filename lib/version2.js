var _ = require('lodash');
var detectVersion     = require('./detect');
var normalizeVersion2 = require('./normalizeVersion2');

// Convert a summary tree into a flatten list of chapters
function summaryToChaptersList(summary) {
    var out = [];

    function pushChapter(article) {
        if (!article.title || !article.level) return;

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
            if (article.articles) {
                pushChapters(article.articles);
            }
        });
    }

    pushChapters(summary.parts);

    return out;
}

// Convert to a GitBook v2 format
function toVersion2(json) {
    if (detectVersion(json) == 2) {
        return normalizeVersion2(json);
    }

    var output = {
        version: '2'
    };

    // Content as sections
    output.sections = [
        {
            type: 'normal',
            content: json.page.content
        }
    ];

    // Summary as progress
    var chapters = summaryToChaptersList(json.summary);
    output.progress = {
        chapters: chapters,
        percent: 0,
        prevPercent: 0
    };

    // Current chapter
    var current = _.find(chapters, {
        path: json.file.path
    });
    output.progress.current = current;
    if (current) {
        output.progress.percent = (current.index*100)/chapters.length;
        output.progress.prevPercent = (Math.max(0, current.index - 1)*100)/chapters.length;
    }

    // Languages
    if (json.languages) {
        output.langs = _.map(json.languages.list, function(lang) {
            return {
                title: lang.title,
                lang: lang.id,
                path: lang.id
            };
        });
    }

    return output;
}

module.exports = toVersion2;
