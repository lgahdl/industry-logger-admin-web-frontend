<template>
  <b-card
    no-body
    class="pt-2"
  >
    <AddLevelSidebar
      :active.sync="sidebarActive"
      :default-value="sidebarLevel"
      :series="series"
    />
    <custom-button
      :title="$t('#Level #Button Add Level')"
      style="position: absolute; right:0.2rem; top: -5rem; width: max-content; height:max-content"
      :button-style="{height:'100% !important', width: 'max-content', padding:'1rem'}"
      icon="PlusIcon"
      @click="onCreateLevel()"
    />
    <simple-table
      :headers="headers"
      :items="levels"
      draggable
      :on-drag-change="onDragLevelChange"
      :drag-cell-style="{'padding-bottom': '2rem'}"
    >
      <template #cell(title)="{item}">
        <div style="display:flex; min-height:8rem; align-items: center; padding-bottom: 2rem">
          <span style="font-size:25px; font-weight: bolder">{{ item.languages[$i18n.locale].title }}</span>
        </div>
      </template>
      <template #cell(slug)="{item}">
        <div style="display:flex; min-height:8rem; align-items: center; padding-bottom: 2rem">
          <span class="font-weight-bold font-14">{{ item.slug }}</span>
        </div>
      </template>
      <template #cell(actions)="{item}">
        <div
          style="display:flex; flex-direction:row-reverse; min-height:8rem; align-items: center; padding-bottom: 2rem"
        >
          <button-group
            :size="2"
          >
            <template #button(1)>
              <b-dropdown
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="outline-secondary"
                :disabled="item.status!=='active'"
                class="dropdown-icon-wrapper"
              >
                <template #button-content>
                  <b>
                    <feather-icon
                      icon="ChevronDownIcon"
                      size="20"
                    />
                  </b>
                </template>
                <b-dropdown-item-button @click="onDeleteLevel(item)">{{
                  $t("#Button Delete")
                }}
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="onEditLevel(item)">{{
                  $t("#Button Edit")
                }}
                </b-dropdown-item-button>
              </b-dropdown>
            </template>
            <template #button(2)>
              <custom-button
                variant="outline-secondary"
                class="px-1"
                style="width:max-content; height: 100%"
                :title="$t('#Button Open').toUpperCase()"
                :route="{name:'lab-open-level', params: {id: item.id, seriesId: item.seriesId}}"
              />
            </template>
          </button-group>
        </div>
      </template>
    </simple-table>
  </b-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import AddLevelSidebar from './components/sidebar'

export default {
  name: 'IndexVue',
  components: { AddLevelSidebar },
  props: {
    seriesId: {
      type: undefined,
      required: true,
    },
  },
  data() {
    return {
      sidebarActive: false,
      sidebarLevel: null,
      levelsTemp: null,
    }
  },
  computed: {
    ...mapGetters({ pagination: 'level/pagination', levels: 'level/levels', series: 'series/selectedSeries' }),
    headers() {
      return [
        {
          name: 'title',
          title: this.$t('#Level #TableHeader Title'),
          cellStyle: { 'border-bottom': '1px solid #f3f3f3' },
        },
        {
          name: 'slug',
          title: this.$t('#Level #TableHeader Slug'),
          cellStyle: { paddingTop: '10px', paddingLeft: 0, 'border-bottom': '1px solid #f3f3f3' },
        },
        {
          name: 'actions',
          title: '',
          style: { width: '10%' },
          cellStyle: { paddingTop: '10px', paddingLeft: 0, 'border-bottom': '1px solid #f3f3f3' },
        },
      ]
    },
  },
  beforeMount() {
    this.$store.dispatch('series/findById', this.$route.params.id)
    this.$store.dispatch('level/findBySeriesId', { seriesId: this.$route.params.id, pagination: this.pagination })
  },
  methods: {
    ...mapActions({ softDelete: 'level/softDelete', update: 'level/update' }),
    onCreateLevel() {
      this.sidebarActive = !this.sidebarActive
    },
    onDeleteLevel(level) {
      this.$swal({
        icon: 'warning',
        title: this.$t('#SweetAlertTitle Delete Level'),
        html: this.$t('#SweetAlertDescription Delete Level'),
        showCancelButton: true,
        cancelButtonText: this.$t('#SweetAlertButton Cancel'),
        confirmButtonText: this.$t('#SweetAlertButton Confirm'),
        customClass: {
          confirmButton: 'btn btn-secondary color-secondary',
          cancelButton: 'btn btn-danger ml-1',
        },
      }).then(result => {
        if (result.isConfirmed) {
          this.softDelete(level.id).then(() => {
            this.$swal({
              icon: 'success',
              title: this.$t('#SweetAlertTitle Success'),
              html: this.$t('#SweetAlertDescription Success'),
              showConfirmButton: false,
              timer: 1500,
            })
          }).catch(() => {
            this.$swal({
              icon: 'error',
              title: this.$t('#SweetAlertTitle Error'),
              html: this.$t('#SweetAlertDescription Error'),
              confirmButtonText: this.$t('#SweetAlertButton Confirm'),
              showCancelButton: false,
              customClass: {
                confirmButton: 'btn btn-outline-danger background-primary',
              },
            })
          })
        }
      })
    },
    onEditLevel(level) {
      this.sidebarLevel = _.cloneDeep(level)
      this.sidebarActive = !this.sidebarActive
    },
    onDragLevelChange({ moved }) {
      const maxIdx = Math.max(moved.oldIndex, moved.newIndex)
      const minIdx = Math.min(moved.oldIndex, moved.newIndex)
      this.levels.forEach((item, index) => {
        if (index <= maxIdx && index >= minIdx) {
          const level = item
          level.order = index + 1
          this.update({ id: level.id, level })
        }
      })
    },
  },
}
</script>

<style scoped>

</style>