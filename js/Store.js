import constant from './Constants.js';

// Store for application global state
const store = new Vuex.Store({

    state: {
        // Cache for objects, indexed by object id, with resource data as values
        resources: {},
        // Current search results
        search_results: [],
        query: "",
        overview_reference: null,
        overview_neighbors: [],
        // We only have 1 basket
        basket: [],
        // Assume we only deal with 1 sequence in the app
        sequence: [],
        // List of notification messages
        notification_messages: [],
        // Loading message. If not null, display loading spinner
        loading_message: "",
    },

    // Mutation are synchronous. They should normally not be directly called, but instead through actions (see below)
    mutations: {
        update_search_results(state, results) {
            state.search_results = results;
        },
        set_query(state, query) {
            state.query = query;
        },
        add_notification(state, message, type="info") {
            let timestamp = new Date();
            console.log(timestamp, message);
            state.notification_messages.push( {
                message: message,
                type: type,
                date: timestamp
            } );
        },
        remove_notification(state, message) {
            var i = state.notification_messages.map(n => n.message).indexOf(message);
            if (i == -1) {
                return;
            }
            state.notification_messages.splice(i, 1);
        },
        set_overview_reference(state, resource) {
            state.overview_reference = resource;
        },
        set_overview_neighbors(state, neighbors) {
            state.overview_neighbors = neighbors;
        },

        set_loading_message(state, message = "Loading...") {
            state.loading_message = message;
        },

        add_to_basket(state, item) {
            if (state.basket.indexOf(item) == -1) {
                state.basket.push(item);
            }
        }
    },

    // Actions are asynchronous. They are called with the dispatch method (or through mapActions in components)
    actions: {

        async submit_query({ commit }, query) {
            let response = null;

            this.dispatch("start_loading", `Searching for ${query}...`);
            if (query && query.startsWith('d:')) {
                // Debug mode - use local resources
                response = await fetch(`data/${query.substr(2)}.json`, {
                    method: 'GET',
                    cache: 'no-cache',
                });
            } else {
                // Do the asynchronous call to the search API
                response = await fetch(constant.api.search, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ search: query,
                                           type: [],
                                           available_langs: [],
                                           provider: [],
                                           orig_lang: [],
                                           use_model: true,
                                           remove_duplicates: true,
                                           model_type: "wikifier" })
                });
            }
            response.json()
                .catch( (error) => {
                    this.dispatch("stop_loading", "");
                    this.dispatch("show_notification", `Error when fetching ${query}`, "error");
                })
                .then( (data) => {
                    this.dispatch("stop_loading", "");
                    if (!data) {
                        this.dispatch("show_notification", `No data for ${query}`, "error");
                        return;
                    }
                    console.log("query result", data, data.output);
                    let output = data.output;
                    commit('set_query', query);
                    if (output.neighbors) {
                        // FIXME: Debug mode, we use dumps from old knnladmdsh API
                        commit('set_overview_reference', output.res_in_focus);
                        commit('set_overview_neighbors', output.neighbors);
                        output = output.neighbors;
                    }
                    commit('update_search_results', output)
                });
        },

        async activate_overview_reference({ commit }, resource_id) {
            // Query neighbors
            resource_id = Number(resource_id);
            this.dispatch("start_loading", `Fetching neighbors...`);
            let response = null;
            try {
                response = await fetch(
                    // FIXME: Debug mode, we use dumps from old knnladmdsh API
                    resource_id == 1473 ? "data/1.json" : constant.api.neighbors, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ resource_id: resource_id,
                                           n_neighbors: constant.MAX_NEIGHBORS,
                                           type: [],
                                           available_langs: [],
                                           provider: [],
                                           orig_lang: [],
                                           remove_duplicates: true,
                                           model_type: "wikifier" })
                });
            } catch (error) {
                this.dispatch("stop_loading", "");
                this.dispatch("show_notification", `Error while fetching neighbors: ${error}`, "error");

            }
            response.json()
                .catch( (error) => {
                    this.dispatch("stop_loading", "");
                    this.dispatch("show_notification", `Error when fetching neighbors for ${resource_id}`, "error");
                })
                .then( (data) => {
                    this.dispatch("stop_loading", "");
                    if (!data) {
                        this.dispatch("show_notification", `No neighbors for ${resource_id}`, "error");
                        return;
                    }
                    commit("set_overview_reference", data.output.res_in_focus);
                    commit('set_overview_neighbors', data.output.neighbors);
                });
        },

        async show_notification({ commit }, message, type, duration=5000) {
            commit("add_notification", message, type);
            var timeOut = setTimeout(function () {
                // On timeout mutate state to dismiss notification
                commit("remove_notification", message);
            }, duration);
        },

        async add_to_basket({ commit }, item) {
            commit("add_to_basket", item);
        },

        async start_loading({ commit }, message = "Loading...") {
            commit("set_loading_message", message);
        },

        async stop_loading({ commit }) {
            commit("set_loading_message", "");
        },
    }
});

export default store;
