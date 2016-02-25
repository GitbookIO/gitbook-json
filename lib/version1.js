var _ = require('lodash');
var detectVersion = require('./detect');

function summaryToChaptersList(summary) {
    var out = [];

    function pushChapter(article) {
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
    content.progress = {
        chapters: summaryToChaptersList(json.summary)
    };

    return output;
}

module.exports = toVersion1;
