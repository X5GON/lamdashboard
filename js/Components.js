export default {
    ...Object.fromEntries([
        // Main view components
        "Home",
        "Search",
        "Overview",
        "Basket",
        "Sequence",
        "Debug",

        // Other components (alphabetical order)
        "BarLegend",
        "ConceptBar",
        "CountOverlay",
        "ItemDetail",
        "LetterCube",
        "NeighborGraph",
        "RangeSlider",
        "ResourceRepresentation",
        "ResultDrawer",
        "SvgContainer",
        "X5gonToolbar",
    ].map(name => ([ name,
                     // We convert camelCase to kebab-case for component names
                     Vue.component(name
                                   .replace(/^[A-Z]/, m => m.toLowerCase())
                                   .replace(/[A-Z]/g, m => "-" + m.toLowerCase()),
                                   httpVueLoader.load(`js/${name}.vue`))
                   ]))),

    // Specific prefixed components
    Filterbar: Vue.component('x5gon-filterbar', httpVueLoader('js/Filterbar.vue')),
    Header: Vue.component('x5gon-header', httpVueLoader('js/Header.vue')),
    LoadingSpinner: Vue.component('x5gon-loading-spinner', httpVueLoader('js/LoadingSpinner.vue')),
    Notification: Vue.component('x5gon-notification', httpVueLoader('js/Notification.vue')),
}
