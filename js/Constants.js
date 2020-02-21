export default {
    // For neighbors API call
    max_neighbors: 80,
    max_search_results: 30,
    concept_mapping_from_reference: false,
    max_concepts: 5,
    api: {
        search: 'http://wp3dev.x5gon.org/others/modelsdsh/search',
        neighbors: 'http://wp3dev.x5gon.org/others/modelsdsh/neighbors',

        sequence_sort: 'http://wp3dev.x5gon.org/sequencing/sort',
        sequence_insert: 'http://wp3dev.x5gon.org/sequencing/insert',

    },
    // For resource representation
    max_duration: 7200,
    max_difficulty: 1,
    max_width: 50,
    max_height: 200,
    // In Overview
    selection_lock_timeout: 1000,
    // Color palettes
    palette: {
        concepts: [ "#ff7070", "#18ffc3", "#d7d680", "#5db2fa", "#8888e2", "#505973", "#e95c44", "#be4b4d", "#933b50", "#3e1966" ],
        blue_concepts: [ "#4279FF", "#719AFF", "#A0BCFF", "#D0DDFF", "#FFFFFF" ],
    }
}
