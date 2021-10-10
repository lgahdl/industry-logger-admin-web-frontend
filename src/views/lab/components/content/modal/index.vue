<template>
  <b-modal
    :id="id"
    ref="modal"
    v-model="showModal"
    :title="$t('#Content #ModalTitle Add Content')"
    size="lg"
    class="p-2"
    @change="closeModal"
  >
    <div class="d-flex justify-content-between py-2 pb-3">
      <h2
        class="font-weight-bolder"
        style="width:60%"
      >
        {{ $t(`#Content #ModalStepTitle ${ step }`) }}
      </h2>
      <div style="padding-top:8px; width: 40%">
        <div
          style="position:relative; top: 0; right:2rem; width:23rem;height:4px;background-color:#f3f3f3; border-radius: 4px"
        />
        <div
          style="position: relative; top: -4px; right: 2rem; height:4px; background-color: grey; border-radius: 4px"
          :style="{width: (progress/100) * 23 + 'rem', backgroundColor: progress===100? '#3888FF !important' : 'grey'}"
        />
        <div style="position: relative; top: 2px; left: -2rem">
          <span>{{ progress }}%</span>
        </div>
      </div>
    </div>
    <transition
      name="fade"
      mode="out-in"
    >
      <info-step
        v-if="step=='info'"
        :content.sync="content"
        :on-submit="infoSubmit"
        :on-cancel="closeModal"
        :initial-title="initialTitle"
      />
      <type-step
        v-if="step=='type'"
        :content.sync="content"
        :on-submit="typeSubmit"
        :on-cancel="closeModal"
      />
      <file-step
        v-if="step=='file'"
        :content.sync="content"
        :on-submit="fileSubmit"
        :on-cancel="closeModal"
        :progress.sync="progress"
      >
        Hello! Type
      </file-step>
      <completed-step
        v-if="step==='completed'"
        :content.sync="content"
        :on-submit="closeModal"
      />
    </transition>
    <template #modal-footer>
      <div />
    </template>
  </b-modal>
</template>

<script>
import formValidation from '@core/comp-functions/forms/form-validation'
import { mapActions } from 'vuex'
import InfoStep from './steps/info'
import TypeStep from './steps/type'
import FileStep from './steps/file'
import CompletedStep from './steps/completed'

export default {
  name: 'ContentModal',
  components: {
    InfoStep, TypeStep, FileStep, CompletedStep,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
    defaultValue: {
      type: undefined,
      required: false,
      default: () => ({
        languages: {
          'pt-br': {
            title: '',
            name: '',
          },
        },
      }),
    },
    level: {
      type: undefined,
      required: true,
    },
  },
  data() {
    return {
      forceRenderKey: 0,
      initialTitle: '',
      content: {
        languages: {
          'pt-br': {
            title: '',
            description: '',
          },
        },
        slug: '',
        files: [],
      },
      emptyContent: {
        languages: {
          'pt-br': {
            title: '',
            description: '',
          },
        },
        slug: '',
        files: [],
      },
      step: 'info',
      progress: 20,
    }
  },
  computed: {
    showModal: {
      get() {
        return this.value
      },
      set(value) {
        this.step = 'info'
        this.$emit('input', value)
      },
    },
    title() {
      return 'Preencha as informações'
    },
    form() {
      const {
        refFormObserver,
        getValidationState,
        resetForm,
      } = formValidation(this.resetLevel)
      return {
        refFormObserver,
        getValidationState,
        resetForm,
      }
    },
    getValidationState() {
      return this.form.getValidationState
    },
    resetForm() {
      return this.form.resetForm
    },
  },
  watch: {
    defaultValue(newValue) {
      this.content = newValue
      this.forceRenderKey += 1
      this.initialTitle = newValue.languages[this.$i18n.locale].title
    },
  },
  methods: {
    ...mapActions({ create: 'content/create', update: 'content/update' }),
    infoSubmit() {
      this.step = 'type'
      this.progress = 50
    },
    async fileSubmit() {
      this.content.levelContents = [{ levelId: this.level.id, order: this.level.contents?.length }]
      this.content = await this.create(this.content)
      this.step = 'completed'
      this.progress = 100
    },
    async typeSubmit() {
      if (this.content.files.length === 0) {
        this.step = 'file'
        this.progress = 90
      } else if (this.content.id) {
        this.content = await this.update({ id: this.content.id, content: this.content })
        this.step = 'completed'
        this.progress = 100
      } else {
        this.closeModal()
      }
    },
    closeModal() {
      this.progress = 20
      this.step = 'info'
      this.content = this.emptyContent
      this.$emit('input', !this.value)
    },
  },
}
</script>

<style lang="scss">
.modal-content {
  padding: 2rem;
}
</style>