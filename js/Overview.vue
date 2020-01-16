<template>
  <div class="view-overview">
    <result-drawer class="left-drawer" :results="search_results" @active="set_active"></result-drawer>
    <div class="right-drawer">
      <item-detail :style="{ width: '70%' }" :item="active_resource"></item-detail>
      <bar-legend :style="{ width: '25%' }" title="Concepts" :items="active_resource_legend"></bar-legend>
    </div>
  </div>
</template>

<script>
    module.exports = {
        components: {
            'result-drawer': httpVueLoader('js/ResultDrawer.vue'),
            'item-detail': httpVueLoader('js/ItemDetail.vue'),
            'bar-legend': httpVueLoader('js/BarLegend.vue')
        },
        props: {
        },
        data: function() {
            return {
                active_resource: null
            }
        },
        methods: {
          set_active: function (resource) {
              console.log("Overview - set_active", resource);
              this.active_resource = resource;
          }
        },
        computed: {
            ...Vuex.mapState([ "search_results" ]),
            active_resource_id: function () {
                return this.active_resource !== null ? this.active_resource.url : "null";
            },
            active_resource_legend: function () {
                // Get the 5 top concepts of the resource
                if (this.active_resource === null)
                    return null;
                return [
                    [
                        "Voxel",
                        "http://en.wikipedia.org/wiki/Voxel",
                        0.007178634185829779,
                        0.15250415330651737
                    ],
                    [
                        "Brain",
                        "http://en.wikipedia.org/wiki/Brain",
                        0.007178634185829779,
                        0.3948504501157241
                    ],
                    [
                        "Neuroscience",
                        "http://en.wikipedia.org/wiki/Neuroscience",
                        0.003918594338552176,
                        0.2598512031787645
                    ],
                    [
                        "Neuron",
                        "http://en.wikipedia.org/wiki/Neuron",
                        0.003190581832126049,
                        0.1680247074361474
                    ],
                    [
                        "Stimulus (physiology)",
                        "http://en.wikipedia.org/wiki/Stimulus_(physiology)",
                        0.003178383788377945,
                        0.30299689254684864
                    ],
                    [
                        "Overfitting",
                        "http://en.wikipedia.org/wiki/Overfitting",
                        0.0029340111255755563,
                        0.1628208589786088
                    ],
                    [
                        "Computer vision",
                        "http://en.wikipedia.org/wiki/Computer_vision",
                        0.0023786203322898694,
                        0.1047853803949352
                    ],
                    [
                        "Computational model",
                        "http://en.wikipedia.org/wiki/Computational_model",
                        0.0021685764506235686,
                        0.15095315172810972
                    ]
                ].slice(0, 5).map((t, i) => ({ label: t[0],
                                               url: t[1],
                                               value: t[3],
                                               width: t[3] * 200,
                                               color: [ "#3e1966", "#933b50", "#be4b4d", "#e95c44", "#505973" ][i]
                                             }));
            }
        }
    }
</script>

  <style type="text/css">
  .view-overview {
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
  }
  .left-drawer, .right-drawer {
      margin: 0;
      padding: 0;
      width: 50%;
  }
  .right-drawer {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: row;
      height: 100vh;
      align-items: center;
      justify-content: space-between;
  }
</style>
