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
        notification_messages: []
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
            state.notification_messages.push( {
                message: message,
                type: type,
                date: new Date()
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
        }
    },

    // Actions are asynchronous. They are called with the dispatch method (or through mapActions in components)
    actions: {

        async submit_query({ commit }, query) {
            let response = null;

            if (query.startsWith('d:')) {
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
                    console.log("Error when fetching ", error);
                    this.dispatch("show_notification", `Error when fetching ${query}`, "error");
                })
                .then( (data) => {
                    if (!data) {
                        this.dispatch("show_notification", `No data for ${query}`, "error");
                        return;
                    }
                    console.log("query result", data, data.output);
                    let output = data.output;
                    commit('set_query', query);
                    if (data.neighbors) {
                        // FIXME: Debug mode, we use dumps from old knnladmdsh API
                        output = data.neighbors;

                        commit('set_overview_reference', data.res_in_focus);
                        commit('set_overview_neighbors', data.neighbors);

                    }
                    commit('update_search_results', output)
                });
        },

        async activate_overview_reference({ commit }, resource) {
            if (typeof resource !== 'object') {
                // We are not given a plain resource. Try to get it from cache.
                resource = this.state.resources[resource];
            }
            // Query neighbors
            response = await fetch(constant.api.neighbors, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                body: JSON.stringify({ resource_id: resource.id,
                                       n_neighbors: constant.MAX_NEIGHBORS })
            });
            response.json()
                .catch( (error) => {
                    console.log("Error when fetching KNN ", error);
                    this.dispatch("show_notification", `Error when fetching neighbors for ${resource.id}`, "error");
                })
                .then( (data) => {
                    if (!data) {
                        this.dispatch("show_notification", `No neighbors for ${resource.id}`, "error");
                        return;
                    }
                    commit("set_overview_reference", data.res_in_focus);
                    commit('set_overview_neighbors', data.neighbors);
                });
        },

        async show_notification({ commit }, message, type, duration=2000) {
            commit("add_notification", message, type);
            var timeOut = setTimeout(function () {
                // On timeout mutate state to dismiss notification
                commit("remove_notification", message);
            }, duration);
        }
    }
});

export default store;
