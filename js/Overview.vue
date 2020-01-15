<template>
  <div class="view-overview">
    <result-drawer class="left-drawer" :results="results" @active="set_active"></result-drawer>
    <item-detail class="right-drawer" :item="active_resource"></item-detail>
  </div>
</template>

<script>
    module.exports = {
        components: {
            'result-drawer': httpVueLoader('js/ResultDrawer.vue'),
            'item-detail': httpVueLoader('js/ItemDetail.vue')
        },
        props: {
            results: {
                type: Array,
                default: function () {
                    return [
                        {
                            'name': 'name1',
                            'provider': 'provider1',
                            'author': 'author1',
                            'url': 'url1'
                        },
                        {
                            'name': 'name2',
                            'provider': 'provider2',
                            'author': 'author2',
                            'url': 'url2'
                        },
                        {
                            'name': 'name3',
                            'provider': 'provider3',
                            'author': 'author3',
                            'url': 'url3'
                        },
                        {
                            'name': 'name4',
                            'provider': 'provider4',
                            'author': 'author4',
                            'url': 'url4'
                        },
                        {
                            'name': 'name5',
                            'provider': 'provider5',
                            'author': 'author5',
                            'url': 'url5'
                        },
                        {
                            'name': 'name6',
                          'provider': 'provider6',
                            'author': 'author6',
                            'url': 'url6'
                        }
                  ]
                }
            }
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
            active_resource_id: function () {
                return this.active_resource !== null ? this.active_resource.url : "null";
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
  .left-drawer, .right_drawer {
    width: 50%;
  }
</style>
