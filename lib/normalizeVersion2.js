/**
 * Normalize gitbook version 2 JSON
 * @param  {JSON} json
 * @return {JSON}
 */
function normalizeVersion2(json) {
    // Ensure sections is not an empty array
    if (json.sections.length == 0) {
        json.sections = [{
            type: 'normal',
            content: ''
        }];
    }

    return json;
}

module.exports = normalizeVersion2;
