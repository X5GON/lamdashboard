export default {
    Notification: Vue.component('x5gon-notification', httpVueLoader('js/Notification.vue')),
    LoadingSpinner: Vue.component('x5gon-loading-spinner', httpVueLoader('js/LoadingSpinner.vue')),
    LetterCube: Vue.component('letter-cube', httpVueLoader.load('js/LetterCube.vue')),

    // Main view components
    Home: httpVueLoader('js/Home.vue'),
    Search: httpVueLoader('js/Search.vue'),
    Overview: httpVueLoader('js/Overview.vue'),
    Basket: httpVueLoader('js/Basket.vue'),
    Sequence: httpVueLoader('js/Sequence.vue'),
    Debug: httpVueLoader('js/Debug.vue'),

    
}
