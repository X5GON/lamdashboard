import constant from './Constants.js';

/**
 * Randomly shuffle an array (in place)
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
let shuffle = function (array) {

    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
      while (0 !== currentIndex) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
      }

    return array;

};

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
            results.forEach(r => {
                                   r.duration = moment.duration(r.duration).asSeconds();
                                 });

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
            // Build an object holding the N most important concepts for the resource

            // We normalize here the concepts array, which stores the
            // top N concepts with { value, label, url } attributes
            resource.duration = moment.duration(resource.duration).asSeconds();
            state.overview_reference = resource;
        },
        set_overview_neighbors(state, neighbors) {
            neighbors.forEach(r => {
                r.duration = moment.duration(r.duration).asSeconds();
            });
            state.overview_neighbors = neighbors;
        },

        set_loading_message(state, message = "Loading...") {
            state.loading_message = message;
        },

        add_to_basket(state, item) {
            if (state.basket.indexOf(item) == -1) {
                state.basket.push(item);
            }
        },
        populate_basket(state, count) {
            // Debug method - populate the basket with count items from overview_neighbors
            let items = shuffle(state.overview_neighbors.slice()).slice(0, count);
            items.forEach(item => this.commit('add_to_basket', item));
        },

        set_sequence(state, sequence) {
            state.sequence = sequence;
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
                    body: JSON.stringify({ q: query,
                                           max_resources: constant.max_search_results,
                                           max_concepts: constant.max_concepts,
                                         })
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
                    console.log("query result", data, data.result);
                    let result = data.result;
                    commit('set_query', query);
                    /*
                    if (output && output.neighbors) {
                    // FIXME: Debug mode, we use dumps from old knnladmdsh API
                    commit('set_overview_reference', output.res_in_focus);
                        commit('set_overview_neighbors', output.neighbors);
                        commit('populate_basket', 10);
                        commit('set_sequence', shuffle(this.state.basket.slice()));
                        output = output.neighbors;
                    }
                    */
                    commit('update_search_results', result);
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
                    resource_id == 23345 ? "data/n23345.json" : constant.api.neighbors, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ id: resource_id,
                                           max_concepts: constant.max_concepts,
                                           max_resources: constant.max_neighbors
                                         })
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
                    commit("set_overview_reference", data.reference);
                    commit('set_overview_neighbors', data.neighbors);
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

        async populate_basket({ commit }, count) {
            commit("populate_basket", count);
        },

        async sort_basket({ commit }) {
            // Call API
            this.dispatch("start_loading", `Sorting basket...`);
            let response = null;
            try {
                response = await fetch(constant.api.sequence_sort, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        basket: this.state.basket.map(item => item.id)
                    })
                });
            } catch (error) {
                this.dispatch("stop_loading", "");
                this.dispatch("show_notification", `Error while sorting basket: ${error}`, "error");

            }
            response.json()
                .catch( (error) => {
                    this.dispatch("stop_loading", "");
                    this.dispatch("show_notification", `Error when sorting basket ${error}`, "error");
                })
                .then( (data) => {
                    this.dispatch("stop_loading", "");
                    commit('set_sequence', data.output);
                });
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
