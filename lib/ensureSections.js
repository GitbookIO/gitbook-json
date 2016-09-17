/**
 * Ensure that sections is not an empty array for version 2
 * @param  {JSON} json
 * @return {JSON}
 */
function ensureSections(json) {
    // Ensure sections is not an empty array
    if (json.sections.length == 0) {
        json.sections = [{
            type: 'normal',
            content: ''
        }];
    }

    return json;
}

module.exports = ensureSections;
