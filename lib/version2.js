var _ = require('lodash');
var detectVersion = require('./detect');

// Convert to a GitBook v3 format
function toVersion2(json) {
    if (detectVersion(json) == 2) return json;

    var output = {};

    // Content as page
    output.page = {
        content: _.pluck(json.sections, 'content').join('\n\n')
    };

    return output;
}

module.exports = toVersion2;
