const store = new Vuex.Store({
    state: {
        // Cache for objects, indexed by object id, with resource data as values
        resources: {},
        // Current search results
        search_results: [],
        query: "",
        // We only have 1 basket
        basket: [],
        // Assume we only deal with 1 sequence in the app
        sequence: [],
        error_message: ""
    },
    mutations: {
        update_search_results (state, results) {
            state.search_results = results;
        },
        set_query(state, query) {
            state.query = query;
        },
    },
    actions: {
        async submit_query({ commit }, query) {
            // Do the asynchronous call to the search API
            const response = await fetch("http://wp3.x5gon.org/others/lamdsh/search", {
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
            response.json()
                .catch( (error) => console.log("Error when fetching", error) )
                .then( (data) => {
                    commit('set_query', query);
                    commit('update_search_results', data.output.map(item => {
                        if (item && item.author) {
                            return { ...item, author: item.author.join(", ") }
                        } else {
                            return item;
                        }
                    }));
                });
        }
    }
});

export default store;
