var _ = require('lodash');
var path = require('path')
var detectVersion = require('./detect');

function levelToDepth(level) {
    return level.split('.').length;
}

// Convert a v1 chapter to a v2 article
function chapterToArticle(chapter) {
    return {
        level: chapter.level,
        title: chapter.title,
        depth: levelToDepth(chapter.level),
        path: chapter.path,
        anchor: null
    };
}

// Convert a list of chapters to a tree
function chaptersToTree(chapters, base) {
    base = base || '';

    return _.chain(chapters)
        .filter(function(chapter) {
            return (chapter.level.indexOf(base) === 0 &&
                levelToDepth(chapter.level) === (levelToDepth(base) + 1));
        })
        .map(function(chapter) {
            var out = chapterToArticle(chapter);
            out.articles = chaptersToTree(chapters, chapter.level);
            if (out.articles.length == 0) delete out.articles;

            return out;
        })
        .value();
}

// Convert to a GitBook v3 format
function toVersion3(json) {
    if (detectVersion(json) == 3) return json;

    var current = json.progress.current;
    var chapters = json.progress.chapters;

    var output = {
        version: '2',
        gitbook: {
            version: "2.6.7",
            time: "2016-02-25T16:19:05.248Z"
        },
        book: {},
    };

    // FAKE
    output.file = {
        path: current.path,
        mtime: '2015-10-29T11:04:28.000Z',
        type: path.extname(current.path).toLowerCase() == '.md'? 'markdown' : 'asciidoc'
    };

    // Content as page
    output.page = {
        title: current.title,
        next: current.next? chapterToArticle(current.next) : null,
        prev: current.index > 0? chapterToArticle(_.find(chapters, { index: current.index - 1 })) : null,
        description: '',
        content: _.pluck(json.sections, 'content').join('\n\n'),
        dir: 'ltr'
    };

    // Summary
    output.summary = {
        parts: [
            {
                title: '',
                articles: chaptersToTree(chapters)
            }
        ]
    };

    return output;
}

module.exports = toVersion3;
