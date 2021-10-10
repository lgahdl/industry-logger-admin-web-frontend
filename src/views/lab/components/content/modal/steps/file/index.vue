<template>
  <div v-if="!content.files || !content.files.length">
    <validation-observer #default="{handleSubmit}">
      <b-form @submit.prevent="handleSubmit(onSubmit)">
        <validation-provider
          #default="validationContext"
          name="Cover Image"
        >
          <b-form-group
            label-for="assetsFieldHandle"
          >
            <div
              style="z-index: 100;border:none !important"
              class="file-input-container justify-content-center"
              @dragover="dragOver"
              @dragleave="dragLeave"
              @drop="drop"
            >
              <input
                v-show="false"
                id="fileInput"
                ref="fileInput"
                type="file"
                :accept="content.type==='ebook' ? '.pdf' : '.mp4, .wmv, .avi'"
                @change="onChangeFile"
              >
              <div
                v-if="!file"
                class="d-flex flex-column align-items-center"
              >
                <img
                  :src="require('@/assets/images/misc/file-cloud.png')"
                  style="width:20rem; height:15rem"
                >
                <h2 class="py-2">
                  {{ $t("#Content #Miscellaneous Drag and Drop") }}
                </h2>
                <span class="py-2">{{ $t("#Content #Miscellaneous Warning File Size") }}</span>
                <custom-button
                  variant="secondary"
                  class="px-1"
                  style="height:40px; width: max-content;"
                  :title="$t('#Button Select File')"
                  icon="FolderIcon"
                  @click="clickFileInput"
                />
              </div>
              <div
                v-else
                class="d-flex flex-column align-items-center"
              >
                <div
                  style="width:200px; height:200px"
                  class="d-flex flex-column align-items-center"
                >
                  <div
                    class="d-flex align-items-center justify-content-center"
                    style="width:200px; height:200px; border-radius: 50%; border:1px solid rgba(0,0,0,0.07)"
                  >
                    <feather-icon
                      icon="FilmIcon"
                      size="35"
                    />
                  </div>
                  <template v-if="!uploading">
                    <div
                      v-if="valid"
                      style="position: relative; left: 5rem; top:-2rem; border-radius: 13px;
                    padding-left: 1rem; padding-right:1rem; background-color: #CDFAE0; color:#25CA69"
                    >
                      {{ $t(`#Noun valid`) }}
                    </div>
                    <div
                      v-else
                      style="position: relative; left: 5rem; top:-2rem; border-radius: 13px;
                    padding-left: 1rem; padding-right:1rem; background-color:#ff7961; color:#ba000d"
                    >
                      {{ $t(`#Noun invalid`) }}
                    </div>
                  </template>
                </div>
                <div class="pt-2 d-flex flex-column align-items-center">
                  <h2>{{ file.name }}</h2>
                  <span>{{ $t("#Noun File") }} {{ file.type.split('/')[1].toUpperCase() }} / {{ fileSize }} MB</span>
                  <template v-if="content.type==='video'">
                    <span>{{ formattedVideoDuration }}</span>
                  </template>
                  <template v-if="content.type==='ebook'">
                    <span>{{ $t("#Noun Pages") }}: {{ pdfPages }}</span>
                  </template>
                </div>
                <div
                  v-if="!uploading"
                  class="py-2"
                >
                  <custom-button
                    variant="outline-primary"
                    class="px-1 mr-1"
                    style="height:40px; width: max-content;"
                    :title="$t('#Button Select Another File')"
                    icon="RepeatIcon"
                    @click="clickFileInput"
                  />
                  <custom-button
                    variant="secondary"
                    class="px-1"
                    style="height:40px; width: max-content;"
                    :title="$t('#Button Upload File')"
                    :disabled="!valid"
                    icon="UploadIcon"
                    @click="uploadFile"
                  />
                </div>
                <div
                  v-else
                  class="py-2"
                >
                  <b-spinner variant="secondary" />
                </div>
              </div>
              <span class="undermessage-error">{{ validationContext.errors[0] }}</span>
            </div>
          </b-form-group>
        </validation-provider>
        <div class="d-flex flex-row-reverse">
          <cancel-button @click="onCancel" />
        </div>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import UploadFileService from '@/services/upload-file.service'

export default {
  name: 'FileStep',
  props: {
    content: {
      type: undefined,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
    onCancel: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      file: null,
      uploading: false,
      videoDuration: 0,
      pdfPages: 0,
    }
  },
  computed: {
    fileSize() {
      const fileSize = Math.round(this.file.size / (1024 * 1024))
      return fileSize > 0 ? fileSize : '< 0'
    },
    valid() {
      return this.fileSize <= 1024 || this.fileSize === '< 0'
    },
    formattedVideoDuration() {
      const hoursEquation = this.videoDuration / 3600
      const minutesEquation = (this.videoDuration % 3600) / 60
      const secondsEquation = (this.videoDuration % 3600) % 60
      const hours = String(Math.floor(hoursEquation)).padStart(2, '0')
      const minutes = String(Math.floor(minutesEquation)).padStart(2, '0')
      const seconds = String(Math.floor(secondsEquation)).padStart(2, '0')
      return [hours, minutes, seconds].join(':')
    },
  },
  methods: {
    onChangeFile() {
      [this.file] = this.$refs.fileInput.files
      if (this.file) {
        if (this.content.type === 'video') {
          this.createVideoDoc()
        } else if (this.content.type === 'ebook') {
          this.createPdfDoc()
        }
        this.$emit('update:progress', 95)
      } else {
        this.$emit('update:progress', 90)
      }
    },
    dragOver(event) {
      event.preventDefault()
      // Add some visual fluff to show the user can drop its files
      if (!event.currentTarget.classList.contains('bg-green-300')) {
        event.currentTarget.classList.remove('bg-gray-100')
        event.currentTarget.classList.add('bg-green-300')
      }
    },
    dragLeave(event) {
      // Clean up
      event.currentTarget.classList.add('bg-gray-100')
      event.currentTarget.classList.remove('bg-green-300')
    },
    drop(event) {
      event.preventDefault()
      this.$refs.fileInput.files = event.dataTransfer.files
      this.onChangeFile() // Trigger the onChange event manually
      // Clean up
      event.currentTarget.classList.add('bg-gray-100')
      event.currentTarget.classList.remove('bg-green-300')
    },
    async uploadFile() {
      this.uploading = true
      const filename = await UploadFileService.uploadFile(this.file)
      const { content } = this
      content.files = [{
        contentId: content.id, filename, duration: this.videoDuration, pages: null, status: 'active',
      }]
      this.$emit('update:content', content)
      this.onSubmit()
      this.uploading = false
    },
    clickFileInput() {
      document.getElementById('fileInput').click()
    },
    createVideoDoc() {
      const videoDoc = document.createElement('video')
      videoDoc.preload = 'metadata'
      videoDoc.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoDoc.src)
        this.videoDuration = videoDoc.duration
      }
      videoDoc.src = URL.createObjectURL(this.file)
    },
    createPdfDoc() {
      const reader = new FileReader()
      reader.readAsBinaryString(this.file)
      reader.onloadend = () => {
        this.pdfPages = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length
      }
    },
  },
}
</script>

<style scoped>

</style>