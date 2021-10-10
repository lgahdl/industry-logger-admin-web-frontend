<template>
  <page-container-with-scroll>
    <content-modal
      id="contentModal"
      v-model="showContentModal"
      :level="level"
      :default-value="selectedContent"
    />
    <page-header :title="level.languages[$i18n.locale].title" />
    <page-content>
      <div class="d-flex py-3 flex-row-reverse w-100">
        <custom-button
          v-b-modal.contentModal
          :title="$t('#Content #Button Add Content')"
          class="px-1"
          style="width: max-content; height:40px;"
          icon="PlusIcon"
          @click="onCreateContent()"
        />
        <custom-button
          variant="outline-primary"
          class="px-1 mr-1"
          style="width:max-content; height:40px"
          :title="$t('#Button Erase All')"
          icon="Trash2Icon"
          @click="onEraseAllContent()"
        />
      </div>
      <simple-table
        :items="contents"
        :headers="headers"
        draggable
        :on-drag-change="onDragContentChange"
        :drag-cell-style="{'padding-top': '1.5rem'}"
      >
        <template #cell(image)="{item}">
          <div
            style="align-items: center; justify-content: center;
                                              display:flex; width: 192px; max-width:192px;
                                              height:108px; border-radius: 3px;
                                              border: 1px solid rgba(0, 0, 0, 0.07)"
          >
            <feather-icon
              :icon="item.type === 'exercise' ? 'BookOpenIcon' : item.type === 'ebook' ? 'FileIcon' : 'PlayIcon'"
              size="26"
            />
          </div>
        </template>
        <template #cell(name)="{item}">
          <span class="font-weight-bolder">{{
            item && item.languages[$i18n.locale] ? item.languages[$i18n.locale].title : ''
          }}</span>
        </template>
        <template #cell(type)="{item}">
          <span>{{ $t(`#Enums #TypeEnum ${ item.type }`) }}</span>
        </template>
        <template #cell(actions)="{item}">
          <div
            style="display: flex; flex-direction: row-reverse; height: 100%"
          >

            <button-group :size="2">
              <template #button(1)>
                <custom-button
                  variant="outline-primary"
                  class="pl-1"
                  style="width:max-content; height:40px"
                  icon="Trash2Icon"
                  @click="onDeleteContent(item)"
                />
              </template>
              <template #button(2)>
                <custom-button
                  variant="outline-primary"
                  class="pl-1"
                  style="width:max-content; height:40px"
                  icon="Edit3Icon"
                  @click="onEditContent(item)"
                />
              </template>
            </button-group>
          </div>
        </template>
      </simple-table>
    </page-content>
  </page-container-with-scroll>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import ContentModal from '../components/content/modal'

export default {
  name: 'IndexVue',
  components: { ContentModal },
  data() {
    return {
      showContentModal: false,
      contents: [],
      selectedContent: {
        languages: {
          'pt-br': {
            title: '',
            name: '',
          },
        },
        files: [],
      },
      emptyContent: {
        languages: {
          'pt-br': {
            title: '',
            name: '',
          },
        },
        files: [],
      },
    }
  },
  computed: {
    ...mapGetters({ level: 'level/selectedLevel', contentsFromStore: 'content/contents' }),
    headers() {
      return [
        {
          name: 'image', title: '', style: { width: '25%' }, cellClass: 'pt-2 pr-2 d-flex flex-row',
        },
        {
          name: 'name',
          title: this.$t('#Content #TableHeader Name'),
          style: { width: '35%' },
          cellClass: 'ml-4',
          cellStyle: { 'border-bottom': '1px solid #f3f3f3' },
        },
        {
          name: 'type',
          title: this.$t('#Content #TableHeader Type'),
          style: { width: '30%' },
          cellStyle: { 'border-bottom': '1px solid #f3f3f3' },
        },
        {
          name: 'actions',
          title: '',
          style: { width: '10%' },
          cellStyle: {
            'border-bottom': '1px solid #f3f3f3',
          },
        },
      ]
    },
  },
  watch: {
    contentsFromStore(value) {
      this.contents = _.cloneDeep(value).sort((c1, c2) => {
        if (c1 && c1.levelContents && c1.levelContents.length > 0 && c2 && c2.levelContents && c2.levelContents.length > 0) {
          return c1.levelContents[0].order - c2.levelContents[0].order
        }
        return 0
      })
    },
  },
  beforeMount() {
    this.$store.dispatch('level/findById', this.$route.params.id)
    this.$store.dispatch('content/findByLevelId', this.$route.params.id)
  },
  methods: {
    ...mapActions({ softDelete: 'content/softDelete', update: 'content/update' }),
    onCreateContent() {
      this.selectedContent = this.emptyContent
      this.showContentModal = !this.showContentModal
    },
    onEditContent(content) {
      this.selectedContent = _.cloneDeep(content)
      this.showContentModal = !this.showContentModal
    },
    onDragContentChange({ moved }) {
      const maxIdx = Math.max(moved.oldIndex, moved.newIndex)
      const minIdx = Math.min(moved.oldIndex, moved.newIndex)
      const contentsOrdered = this.contents.map((item, index) => {
        if (index <= maxIdx && index >= minIdx) {
          const content = item
          content.levelContents[0].order = index + 1
          return content
        }
        return undefined
      }).filter(item => !!item)
      contentsOrdered.forEach(content => this.update({ id: content.id, content }))
    },
    onDeleteContent(content) {
      this.$swal({
        icon: 'warning',
        title: this.$t('#SweetAlertTitle Delete Content'),
        html: this.$t('#SweetAlertDescription Delete Content'),
        showCancelButton: true,
        cancelButtonText: this.$t('#SweetAlertButton Cancel'),
        confirmButtonText: this.$t('#SweetAlertButton Confirm'),
        customClass: {
          confirmButton: 'btn btn-secondary color-secondary',
          cancelButton: 'btn btn-danger ml-1',
        },
      }).then(result => {
        if (result.isConfirmed) {
          this.softDelete(content.id).then(() => {
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
    onEraseAllContent() {
      this.$swal({
        icon: 'warning',
        title: this.$t('#SweetAlertTitle Erase All Contents'),
        html: this.$t('#SweetAlertDescription Erase All Contents'),
        showCancelButton: true,
        cancelButtonText: this.$t('#SweetAlertButton Cancel'),
        confirmButtonText: this.$t('#SweetAlertButton Confirm'),
        customClass: {
          confirmButton: 'btn btn-secondary color-secondary',
          cancelButton: 'btn btn-danger ml-1',
        },
      }).then(result => {
        if (result.isConfirmed) {
          const deletePromises = this.contents.map(content => this.softDelete(content.id))
          Promise.all(deletePromises).then(() => {
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

<style scoped>

</style>