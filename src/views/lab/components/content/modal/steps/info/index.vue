<template>
  <div>
    <validation-observer
      #default="{handleSubmit}"
      ref="refFormObserver"
    >
      <b-form @submit.prevent="handleSubmit(onSubmit)">
        <form-input
          v-model="content.languages[$i18n.locale].title"
          :name="$t('#Content #FormInputTitle Title')"
          :rules="{required: true, noRepeated: contentsTitles}"
          :title="$t('#Content #FormInputTitle Title')"
          :placeholder="$t('#Content #FormInputPlaceholder Title')"
          @change="createSlug"
        />
        <form-input
          :key="forceRenderKey"
          v-model="content.slug"
          disabled
          :name="$t('#Content #FormInputTitle Slug')"
          rules="required"
          :title="$t('#Content #FormInputTitle Slug')"
          :placeholder="$t('#Content #FormInputPlaceholder Slug')"
        />
        <span
          style="color:#a4a4a4;position:relative; top:-15px"
        >
          {{ $t("#Content #FormInputWarning Slug") }}
        </span>
        <validation-provider
          #default="validationContext"
          :name="$t('#Content #FormInputTitle Description')"
        >
          <b-form-group
            :label="$t('#Content #FormInputTitle Description')"
            label-for="description"
          >
            <quill-editor
              v-model="content.languages[$i18n.locale].description"
              :options="editorOption"
            >
              <div
                id="toolbar"
                slot="toolbar"
                style="width:max-content; border-radius: 13px; border: 0 !important; box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25), 0px 2px 2px rgba(0, 0, 0, 0.1);"
              >
                <!-- Add a bold button -->
                <button class="ql-bold">
                  Bold
                </button>
                <button class="ql-italic">
                  Italic
                </button>
                <button class="ql-underline">
                  Underline
                </button>
              </div>
            </quill-editor>
            <span class="undermessage-error">{{ validationContext.errors[0] }}</span>
          </b-form-group>
        </validation-provider>
        <hr>
        <div class="d-flex flex-row-reverse">
          <custom-button
            style="width:max-content; height:40px; padding: 1rem 1rem 1rem 1.5rem"
            :title="$t('#Button Next')"
            variant="secondary"
            append-icon="ArrowRightIcon"
            type="submit"
          />
          <cancel-button @click="onCancel" />
        </div>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
// eslint-disable-next-line
import 'quill/dist/quill.bubble.css'
// eslint-disable-next-line
import 'quill/dist/quill.core.css'
// eslint-disable-next-line
import 'quill/dist/quill.snow.css'
import utils from '@/helpers/utils'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'InfoStep',
  props: {
    content: {
      type: undefined,
      required: true,
    },
    initialTitle: {
      type: String,
      required: false,
      default: '',
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
      progress: 20,
      editorOption: {
        modules: {
          toolbar: '#toolbar',
        },
        placeholder: this.$t('#Content #FormInputPlaceholder Description'),
      },
      forceRenderKey: 0,
    }
  },
  computed: {
    ...mapGetters({ slugs: 'content/slugs', contents: 'content/contents' }),
    contentsTitles() {
      const { contents } = this
      const languagesArray = _.flatten(contents.map(content => Object.values(content.languages)))
      const titlesArray = languagesArray && languagesArray.filter(language => !!language.title).map(({ title }) => title)
      if (this.content.id && this.initialTitle) {
        titlesArray.splice(titlesArray.indexOf(this.initialTitle), 1)
      }
      return titlesArray
    },
  },
  watch: {
    content() {
      this.forceRenderKey += 1
    },
  },
  methods: {
    ...mapActions({ findByLevelId: 'content/findByLevelId' }),
    async createSlug(title) {
      await this.findByLevelId(this.$route.params.id)
      let slug = utils.convertExpressionToSlug(title)
      if (slug) {
        const slugOccurrences = this.slugs.filter(singleSlug => singleSlug.indexOf(`${slug}-`) > -1).length
        if (slugOccurrences > 0) {
          slug += `-${slugOccurrences + 1}`
        }
      }
      this.content.languages[this.$i18n.locale].title = title
      this.content.slug = slug
      this.$emit('update:content', this.content)
      this.forceRenderKey += 1
    },
  },
}
</script>

<style lang="scss">
.ql-container {
  margin-top: 15px;
  border-radius: 13px;

  &.ql-snow {
    border: 0 !important;
  }

}

.quill-editor {
  padding: 1rem;
  border-radius: 18px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
}

</style>