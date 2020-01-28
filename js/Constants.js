export default {
    // For neighbors API call
    MAX_NEIGHBORS: 60,
    concept_mapping_from_reference: false,
    max_concepts: 5,
    api: {
        search: "http://wp3.x5gon.org/others/lamdsh/search",
        neighbors: "http://wp3.x5gon.org/others/lamdsh/knnlamdsh",
        sort_basket: "http://wp3dev.x5gon.org/sequencing/sort",
    },
    // For resource representation
    max_duration: 100000,
    max_difficulty: 40,
    max_width: 50,
    max_height: 105,
    // Color palettes
    palette: {
        concepts: [ "#505973", "#e95c44", "#be4b4d", "#933b50", "#3e1966" ],
        blue_concepts: [ "#4279FF", "#719AFF", "#A0BCFF", "#D0DDFF", "#FFFFFF" ],
    }
}
