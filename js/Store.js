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
        sequence_distances: [],
        // Insert suggestions
        insertions: [],
        // List of notification messages
        notification_messages: [],
        // Loading message. If not null, display loading spinner
        loading_message: "",
        show_help: false,
        // Mbz infos (url and playlistinfos)
        mbzurl : '',
        mbzinfos : {},
    },

    // Mutation are synchronous. They should normally not be directly called, but instead through actions (see below)
    mutations: {
        update_search_results(state, results) {
            state.search_results = results;
            results.forEach(r => state.resources[r.id] = r);
        },
        set_query(state, query) {
            state.query = query;
        },
        // Add a notification message. Since mutations can only take 1
        // parameter, the parameter is an object { message, type }
        add_notification(state, info) {
            let timestamp = new Date();
            console.log(timestamp, info.message);
            state.notification_messages.push( {
                message: info.message,
                type: info.type || "info",
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
            state.resources[resource.id] = resource;
        },
        set_overview_neighbors(state, neighbors) {
            state.overview_neighbors = neighbors;
            neighbors.forEach(r => state.resources[r.id] = r);
        },

        set_loading_message(state, message = "Loading...") {
            state.loading_message = message;
        },

        add_to_basket(state, item) {
            if (state.basket.indexOf(item) == -1) {
                state.basket.push(item);
            }
        },
        remove_from_basket(state, item) {
            let pos = state.basket.indexOf(item);
            if (pos != -1) {
                state.basket.splice(pos, 1);
            }
        },
        populate_basket(state, count) {
            // Debug method - populate the basket with count items from overview_neighbors
            let items = shuffle(state.overview_neighbors.slice()).slice(0, count);
            items.forEach(item => this.commit('add_to_basket', item));
        },

        set_sequence(state, sequence) {
            state.sequence = sequence.map(id => state.resources[id]);
            state.insertions = [];
            console.log("sequence", state.sequence);
        },

        set_sequence_distances(state, distances) {
            state.sequence_distances = distances;
        },

        set_insertions(state, insertions) {
            insertions = insertions.map(i => (i === null ? null : { ...i.resource,
                                                                    insertion_confidence: i.confidence }));
            console.log("insertions", insertions);
            state.insertions = insertions;
            insertions
                .filter(i => i !== null)
                .forEach(r => {
                    // Put the resource into the cache
                    state.resources[r.id] = r
                });
        },

        validate_insertion(state, index) {
            // Insert an item *after* the given index
            // Validate an insertion: put into sequence, replace by 2 nulls in insertions
            let item = state.insertions[index];

            state.sequence.splice(index + 1, 0, item);
            state.insertions.splice(index, 1, null, null);
            item.is_suggested = false;
            console.log("validat_insertion", state.sequence, state.insertions);
        },

        show_help(state, value) {
            state.show_help = !!value;
        },

        mbz_url(state, mbzurl) {
            state.mbzurl = mbzurl;
        },

        mbz_pst_infos(state, mbzinfos) {
            state.mbzinfos = mbzinfos;
        },
    },

    // Actions are asynchronous. They are called with the dispatch method (or through mapActions in components)
    actions: {

        // Generic API query method. It returns a Promise that wraps
        // all errors/exceptions into a single reject clause, and
        // handle start_loading/stop_loading notifications
        // appropriately.
        async query_api({ commit }, query) {
            let { url, params, message, debug } = query;
            let _store = this;
            this.dispatch("start_loading", message);
            return new Promise(function (resolve, reject) {
                try {
                    fetch(url, {
                        method: !debug ? 'POST' : 'GET',
                        //mode: 'cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: !debug ? JSON.stringify(params) : undefined
                    }).catch(error => {
                        _store.dispatch("stop_loading", "");
                        reject(error);
                        return;
                    }).then(response => {
                        if (response === undefined) {
                            _store.dispatch("stop_loading", "");
                            reject("Undefined result");
                            return;
                        }
                        response.json()
                            .catch(error => {
                                _store.dispatch("stop_loading", "");
                                reject(error);
                                return;
                            })
                            .then(data => {
                                _store.dispatch("stop_loading", "");
                                if (!data) {
                                    reject("No data");
                                    return;
                                }
                                resolve(data);
                            })
                    })
                } catch (error) {
                    _store.dispatch("stop_loading", "");
                    reject(error);
                    return;
                }
            });
        },

        async query_api_dwdfile({ commit }, query) {
            let { url, params, message, debug } = query;
            let _store = this;
            this.dispatch("start_loading", message);
            return new Promise(function (resolve, reject) {
                try {
                    fetch(url, {
                        method: !debug ? 'POST' : 'GET',
                        //mode: 'cors',
                        cache: 'no-cache',
                        responseType: 'arraybuffer',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: !debug ? JSON.stringify(params) : undefined
                    }).catch(error => {
                        _store.dispatch("stop_loading", "");
                        reject(error);
                        return;
                    }).then(response => {
                        if (response === undefined) {
                            _store.dispatch("stop_loading", "");
                            reject("Undefined result");
                            return;
                        }
                        response.blob()
                            .catch(error => {
                                _store.dispatch("stop_loading", "");
                                reject(error);
                                return;
                            })
                            .then(data => {
                                _store.dispatch("stop_loading", "");
                                if (!data) {
                                    reject("No data");
                                    return;
                                }
                                data.filename = (response.headers.get('content-disposition') || '').split('filename=')[1];
                                resolve(data);
                            })
                    })
                } catch (error) {
                    _store.dispatch("stop_loading", "");
                    reject(error);
                    return;
                }
            });
        },

        async submit_search_query({ commit }, query) {
            let url = constant.api.search;
            if (query && query.startsWith('d:')) {
                // Debug mode - use local resources
                url = `data/${query.substr(2)}.json`;
            }

            this.dispatch('query_api',
                          { url: url,
                            debug: query.startsWith('d:'),
                            params: {
                                q: query,
                                max_resources: constant.max_search_results,
                                max_concepts: constant.max_concepts,
                            },
                            message: `Searching for ${query}`
                          }).then(data => {
                             if (!data) {
                                 this.dispatch("show_error_notification", `No data for ${query}`);
                                 return;
                             }
                             console.log("query result", data, data.result);
                             let result = data.result;
                             commit('set_query', query);
                             commit('update_search_results', result);
                         }).catch(error => {
                             this.dispatch("show_error_notification", `Error when searching: ${error}`);
                         });
        },

        async activate_overview_reference({ commit }, resource_id) {
            // Query neighbors
            resource_id = Number(resource_id);
            let url = constant.api.neighbors;
            let debug = false;
            // For debugging
            if (resource_id == 23345 || resource_id == 23344) {
                url = `data/n${resource_id}.json`;
                debug = true;
            }

            this.dispatch('query_api',
                          { url: url,
                            debug: debug,
                            params: { id: resource_id,
                                      max_concepts: constant.max_concepts,
                                      max_resources: constant.max_neighbors
                                    },
                            message: "Fetching neighbors..."
                          }).then(data => {
                              commit("set_overview_reference", data.reference);
                              commit('set_overview_neighbors', data.neighbors);
                          }).catch(error => {
                              this.dispatch("show_error_notification", `Error when fetching neighbors: ${error}`);
                          });
        },

        async sort_basket({ commit }) {
            // The sort API does not want to get empty sequences
            if (this.state.basket.length == 0) {
                commit('set_sequence', []);
                return;
            }
            this.dispatch('query_api',
                          { url: constant.api.sequence_sort,
                            params: {
                                basket: this.state.basket.map(item => item.id)
                            },
                            message: "Sorting basket..."
                          }).then(data => {
                              commit('set_sequence', data.output.sequence);
                              commit('set_sequence_distances', data.output.distances);
                          }).catch(error => {
                              this.dispatch("show_error_notification", `Error when sorting basket: ${error}`);
                          });
        },

        async suggest_insertions({ commit }) {
            if (this.state.sequence.length == 0) {
                return;
            }
            this.dispatch('query_api',
                          { url: constant.api.sequence_insert,
                            params: {
                                sequence: this.state.sequence.map(item => item.id),
                                max_concepts: constant.max_concepts,
                            },
                            message: "Fetching resource suggestions..."
                          }).then(data => {
                              commit('set_sequence', data.output.sequence);
                              // This information is no longer valid
                              commit('set_sequence_distances', []);
                              commit('set_insertions', data.output.insertions);
                          }).catch(error => {
                              this.dispatch("show_error_notification", `Error when getting insert suggestions: ${error}`);
                          });
        },

        async export_tombz({ commit }) {
            if (this.state.sequence.length == 0) {
                commit('mbz_url', '');
                commit('mbz_pst_infos', {});
                return;
            }
            return this.dispatch('query_api_dwdfile',
                          { url: constant.api.export_tombz,
                            responseType: 'arraybuffer',
                            headers: {
                                    Accept: "application/octet-stream",
                            },
                            params: {
                                playlist_general_infos: { pst_name: "Playlist from wp3.x5gon.org",
                                                          pst_id: Math.floor(Math.random() * 1001)+1,
                                                          pst_url: "wp3.x5gon.org",
                                                          pst_author: "Anonymous User",
                                                          pst_creation_date: (new Date()).toISOString().slice(0, 19).replace("T", " "),
                                                          pst_thumbnail_url: "",
                                                          pst_description: "This an auto-generated playlist built on wp3.x5gon.org site.",
                                                          pst_license: "CC-BY"},
                                playlist_items: this.state.sequence.map((item , index)=> ({material_id: item.id, x5gon_id: item.id})),
                            },
                            message: "Exporting basket to mbz Moodle file..."
                          }).then(data => {
                              let blob = new Blob([data], {type: data.type}),
                              mbzurl = document.createElement('a');
                              mbzurl.href = window.URL.createObjectURL(blob);
                              mbzurl.download = data.filename;
                              commit('mbz_url', mbzurl);
                              // commit('mbz_pst_infos', params);
                          }).catch(error => {
                              this.dispatch("show_error_notification", `Error when Exporting basket to mbz Moodle file: ${error}`);
                          });
        },

        async show_error_notification({ commit }, message) {
            return this.dispatch('show_notification', { message: message,
                                                        type: 'error' });
        },

        async show_notification({ commit }, message) {
            if (typeof message == 'string') {
                message = { message: message,
                            type: 'info' };
            }
            commit("add_notification", message);
            var timeOut = setTimeout(function () {
                // On timeout mutate state to dismiss notification
                commit("remove_notification", message);
            }, message.duration || 5000);
        },

        async add_to_basket({ commit }, item) {
            commit("add_to_basket", item);
        },

        async remove_from_basket({ commit }, item) {
            commit("remove_from_basket", item);
        },

        async populate_basket({ commit }, count) {
            commit("populate_basket", count);
        },

        async start_loading({ commit }, message = "Loading...") {
            commit("set_loading_message", message);
        },

        async stop_loading({ commit }) {
            commit("set_loading_message", "");
        },

        async validate_insertion({ commit }, index) {
            let item = this.state.insertions[index];
            commit("validate_insertion", index);
            commit("add_to_basket", item);
        },

        async show_help({ commit }) {
            commit("show_help", true);
        },
        async hide_help({ commit }) {
            commit("show_help", false);
        },
    },
    getters: {
        mbzUrl: state => {
          return state.mbzurl;
        }
    }
});

export default store;
