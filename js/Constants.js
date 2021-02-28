export default {
    // For neighbors API call
    max_neighbors: 80,
    max_search_results: 30,
    concept_mapping_from_reference: false,
    max_concepts: 5,
    api: {
        search: 'https://wp3.x5gon.org/others/modelsdsh/search',
        neighbors: 'https://wp3.x5gon.org/others/modelsdsh/neighbors',

        sequence_sort: 'https://wp3.x5gon.org/sequencing/sort',
        sequence_insert: 'https://wp3.x5gon.org/sequencing/insert',
        export_tombz: 'https://wp3.x5gon.org/others/moodle/playlist2mbz',

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
    },
    format_duration: (d) => {
        let minutes = Math.floor(d / 60);
        if (minutes >= 60) {
            return `${Math.floor(minutes / 60)} h ${minutes % 60} min.`;
        } else {
            return `${minutes} min.`;
        }
    }
}
