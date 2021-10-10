<template>
  <page-container-with-scroll>

    <add-serie-sidebar
      :active.sync="sidebarActive"
      :default-value.sync="selectedSeries"
    />
    <b-card
      no-body
      class="pl-5 pr-0 box-shadow-0 w-100 pr-3"
    >
      <b-row class="py-2 pl-1">
        <!-- Per Page -->
        <b-col
          cols="12"
          md="4"
          lg="6"
          class="d-flex align-items-center"
        >
          <span
            class="align-items-center"
            style="font-size:40px; font-weight: bolder"
          >
            {{ $t("#Series #Title Series") }}
          </span>
        </b-col>
        <b-col
          cols="12"
          md="3"
          lg="2"
          class="d-flex align-items-center pr-md-2 pr-3 mb-1 mb-md-0"
        >
          <div class="align-items-center w-100">
            <custom-button
              icon="PlusIcon"
              :title="$t('#Button Create Series')"
              :button-style="{width: '100%', height:'3.27rem'}"
              @click="onCreateSeries()"
            />
          </div>
        </b-col>
        <!-- Search -->
        <b-col
          cols="12"
          md="5"
          lg="4"
          class="d-flex align-items-center justify-content-start pl-1"
        >
          <div class="d-flex align-items-center justify-content-end w-100">
            <b-input-group
              style="width:100%; height:3.27rem; border-radius: 13px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);"
            >
              <template
                #append
              >
                <b-input-group-text
                  style="border-bottom-right-radius:13px; border-top-right-radius: 13px;
                           border: none !important; cursor: pointer"
                  @click="find()"
                >
                  <feather-icon
                    icon="SearchIcon"
                    size="18"
                  />
                </b-input-group-text>
              </template>
              <b-form-input
                v-model="pagination.search"
                style="height:100%; border: none !important; box-shadow: none !important"
                class="d-inline-block"
                :placeholder="$t('#Placeholder Search')"
                @keyup.enter="find()"
              />
            </b-input-group>
          </div>
        </b-col>
      </b-row>
    </b-card>
    <hr
      class="mt-0"
      style="margin-top: 55px !important"
    >
    <div
      style="height:50px; width:100%"
      class="pr-3 my-2 d-flex align-items-center flex-row-reverse"
    >
      <b-pagination
        v-model="pagination.page"
        :total-rows="pagination.total"
        :per-page="pagination.limit"
        class="my-0 pagination-secondary"
        variant="secondary"
        pills
        hide-goto-end-buttons
        style="background-color:transparent"
        @change="find"
      >
        <template #prev-text>
          <feather-icon icon="ArrowLeftIcon" />
        </template>
        <template #next-text>
          <feather-icon icon="ArrowRightIcon" />
        </template>
      </b-pagination>

      <span>
        {{
          `${ $t("#Pagination Page") } ` + pagination.page + ` ${ $t("#Pagination of") } ${ getTotalPages }`
        }}
      </span>
    </div>
    <b-card
      no-body
      class="mb-5 pr-3 pl-5"
      style="border: 0 !important; box-shadow:none !important;"
    >
      <div class="pl-1">
        <simple-table
          :headers="headers"
          :items="series"
        >
          <template #cell(image)="{item}">
            <b-img
              v-if="!!item.coverImageUrl"
              :src="item.coverImageUrl"
              style="width:192px; height:108px;border-radius:3px; border: 0 !important"
              :alt="item.languages[$i18n.locale].title"
            />
            <div
              v-else
              style="align-items: center; justify-content: center;
                                              display:flex; width: 192px; max-width:192px;
                                              height:108px; border-radius: 3px;
                                              border: 1px solid rgba(0, 0, 0, 0.07)"
            >
              <feather-icon
                icon="ImageIcon"
                size="26"
              />
            </div>
          </template>
          <template #cell(title)="{item}">
            <span class="font-weight-bolder">
              {{ item.languages[$i18n.locale].title }}
            </span>
          </template>
          <template #cell(category)="{item}">
            <span
              style="border-radius: 13px; padding: 15px; padding-bottom: 5px; padding-top: 5px"
              :style="categoryTagStyle(item)"
            >
              {{ item.category.languages[$i18n.locale].title }}
            </span>
          </template>
          <template #cell(levels)="{item}">
            <span>
              {{ item.levels.length + " " + $t("#Noun levels") }}
            </span>
          </template>
          <template #cell(students)="{item}">
            <span v-if="item.studentsQt">
              {{ item.studentsQt.match(/([0-9]+)/)[0] + " " + $t("#Noun " + item.studentsQt.match(/[a-z]+/)[0]) }}
            </span>
          </template>
          <template #cell(actions)="{item}">
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
                  <b-dropdown-item-button @click="deleteSeries(item)">{{
                    $t("#Button Delete")
                  }}
                  </b-dropdown-item-button>
                  <b-dropdown-item-button @click="onEditSeries(item)">{{
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
                  :route="{name:'lab-open-series', params: {id: item.id}}"
                />
              </template>
            </button-group>
          </template>
        </simple-table>
      </div>
    </b-card>
  </page-container-with-scroll>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import AddSerieSidebar from './components/sidebar'

export default {
  name: 'IndexVue',
  components: { AddSerieSidebar },
  data: () => ({
    sidebarActive: false,
    selectedSeries: null,
  }),
  computed: {
    ...mapGetters('series', ['series', 'pagination']),
    getTotalPages() {
      return Math.ceil(this.pagination.total / this.pagination.limit)
    },
    headers() {
      return [
        {
          name: 'image', title: '', style: { width: '16%' }, cellClass: 'pt-2 pr-2 d-flex flex-row',
        },
        {
          name: 'title',
          title: this.$t('#Series #TableHeader Title'),
          style: { width: '20%' },
          cellClass: 'ml-4',
          cellStyle: { 'border-bottom': '1px solid #f3f3f3' },
        },
        {
          name: 'category',
          title: this.$t('#Series #TableHeader Category'),
          style: { width: '20%' },
          cellStyle: { 'border-bottom': '1px solid #f3f3f3' },
        },
        {
          name: 'levels',
          title: this.$t('#Series #TableHeader Levels'),
          style: { width: '18%' },
          cellStyle: { 'border-bottom': '1px solid #f3f3f3' },
        },
        {
          name: 'students',
          title: this.$t('#Series #TableHeader Students'),
          style: { width: '16%' },
          cellStyle: { 'border-bottom': '1px solid #f3f3f3' },
        },
        {
          name: 'actions', title: '', style: { width: '10%' }, cellStyle: { 'border-bottom': '1px solid #f3f3f3' },
        },
      ]
    },
  },
  beforeMount() {
    const pagination = _.cloneDeep(this.$store.getters['series/pagination'])
    this.$store.dispatch('series/findAll', pagination)
    this.$store.dispatch('attitude/findAll', { search: '', page: 1, limit: 20 })
  },
  methods: {
    ...mapActions({ findAll: 'series/findAll', softDeleteSeries: 'series/softDelete' }),
    async find(page) {
      const pagination = _.cloneDeep(this.pagination)
      pagination.page = page
      await this.findAll(pagination)
    },
    categoryTagStyle(serie) {
      const color = serie.category.color ? serie.category.color : '#3888FF'
      const colorDec = [
        parseInt(`0x${color.substring(1, 3)}`, 16),
        parseInt(`0x${color.substring(3, 5)}`, 16),
        parseInt(`0x${color.substring(5, 7)}`, 16),
      ]
      return {
        backgroundColor: `rgba(${colorDec.join(',')}, 0.2)`,
        color,
      }
    },
    onCreateSeries() {
      this.selectedSeries = null
      this.sidebarActive = !this.sidebarActive
    },
    onEditSeries(series) {
      this.selectedSeries = series
      this.sidebarActive = !this.sidebarActive
    },
    deleteSeries(series) {
      this.$swal({
        icon: 'warning',
        title: this.$t('#SweetAlertTitle Delete Series'),
        html: this.$t('#SweetAlertDescription Delete Series'),
        showCancelButton: true,
        cancelButtonText: this.$t('#SweetAlertButton Cancel'),
        confirmButtonText: this.$t('#SweetAlertButton Confirm'),
        customClass: {
          confirmButton: 'btn btn-secondary color-secondary',
          cancelButton: 'btn btn-danger ml-1',
        },
      }).then(result => {
        if (result.isConfirmed) {
          this.softDeleteSeries(series.id).then(() => {
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
  },
}
</script>

<style lang="scss">
.rowClass {
  border: 0 !important;

  > td, th {
    border: 0 !important;
  }

}

.page-link {
  background-color: white !important;
}

.btn {
  border: none !important;

  &.disabled, :disabled {
    opacity: 1 !important;
    color: grey !important;
  }
}
</style>
