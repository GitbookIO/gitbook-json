var _ = require('lodash');

// Detect the version used in this json
function detectVersion(json) {
    if (json.version) return Number(json.version);
    return 1;
}

// Convert to a GitBook v2 format
function toVersion1(json) {
    if (detectVersion(json) == 1) return json;
}

// Convert to a GitBook v3 format
function toVersion2(json) {
    if (detectVersion(json) == 2) return json;

}

module.exports = {
    detectVersion: detectVersion,
    toVersion1: toVersion1,
    toVersion2: toVersion2
};
