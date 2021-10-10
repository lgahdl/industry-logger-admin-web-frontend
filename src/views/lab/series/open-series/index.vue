<template>
  <page-container-with-scroll>
    <page-header :title="series.languages[$i18n.locale].title" />
    <page-content>

      <div class="d-flex py-2 w-100 justify-content-between">
        <switch-button
          v-model="currentPage"
          :options="pages"
        />
      </div>
      <template v-if="currentPage==='levels'">
        <level :series-id="$route.params.id" />
      </template>
    </page-content>
  </page-container-with-scroll>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Level from '../../level'

export default {
  name: 'IndexVue',
  components: { Level },
  data() {
    return {
      pages: [{
        label: this.$t('#OpenSeries #SwitchButtonTitle Feedbacks'),
        value: 'feedbacks',
      },
      {
        label: this.$t('#OpenSeries #SwitchButtonTitle Levels'),
        value: 'levels',
      }],
      currentPage: 'feedbacks',
    }
  },
  computed: {
    ...mapGetters({ series: 'series/selectedSeries' }),
  },
  beforeMount() {
    this.$store.dispatch('series/findById', this.$route.params.id)
  },
  methods: {
    ...mapActions('series', ['findById']),
  },
}
</script>

<style scoped>

</style>