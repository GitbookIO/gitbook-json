// Detect the version used in this json
function detectVersion(json) {
    if (json.version) return Number(json.version);
    return 1;
}

module.exports = detectVersion;
