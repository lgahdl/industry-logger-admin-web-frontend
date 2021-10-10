<template>
  <b-sidebar
    id="add-new-serie-sidebar"
    :visible="active"
    bg-variant="white"
    sidebar-class="sidebar-lg smooth-animation"
    shadow
    backdrop
    no-header
    right
    @change="(val)=>$emit('update:active', val)"
  >
    <template
      #default="{ hide }"
    >
      <div
        :key="forceRenderKey"
        class="p-2 d-flex flex-column justify-content-center"
      >

        <h3 class="font-weight-bolder ml-2">
          {{ $t("#Series #SidebarTitle Create Serie") }}
        </h3>
        <validation-observer
          #default="{handleSubmit}"
          ref="refFormObserver"
        >
          <b-form
            class="p-2"
            @submit.prevent="handleSubmit(onSubmit)"
            @reset.prevent="resetForm"
          >
            <form-input
              v-model="level.languages[$i18n.locale].title"
              :name="$t('#Level #FormInputTitle Title')"
              rules="required"
              :title="$t('#Level #FormInputTitle Title')"
              :placeholder="$t('#Level #FormInputPlaceholder Title')"
              @change="createSlug"
            />
            <form-input
              :key="forceRenderKeySlug"
              v-model="level.slug"
              disabled
              :name="$t('#Level #FormInputTitle Slug')"
              rules="required"
              :title="$t('#Level #FormInputTitle Slug')"
              :placeholder="$t('#Level #FormInputPlaceholder Slug')"
            />
            <form-input
              id="order"
              v-model="level.order"
              :name="$t('#Level #FormInputTitle Order')"
              rules="required|numeric"
              :title="$t('#Level #FormInputTitle Order')"
              :placeholder="$t('#Level #FormInputPlaceholder Order')"
            />
            <div class="d-flex flex-row-reverse pt-2">
              <save-button />
              <cancel-button @click="hide" />
            </div>
          </b-form>
        </validation-observer>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import formValidation from '@core/comp-functions/forms/form-validation'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import { mapActions, mapGetters } from 'vuex'
import utils from '@/helpers/utils.js'

export default {
  name: 'Index',
  props: {
    defaultValue: {
      type: undefined,
      required: false,
      default: () => ({
        languages: {
          'pt-br': {
            title: '',
          },
        },
      }),
    },
    series: {
      type: undefined,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      forceRenderKey: 0,
      forceRenderKeySlug: 0,
      level: {
        languages: {
          'pt-br': {
            title: '',
            name: '',
          },
        },
        status: 'active',
        seriesId: this.$route.params.id,
      },
    }
  },
  computed: {
    ...mapGetters({ slugs: 'level/slugs' }),
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
      this.level = newValue
      this.forceRenderKey += 1
      this.resetLevel()
    },
  },
  methods: {
    ...mapActions({ create: 'level/create', update: 'level/update' }),
    resetLevel() {
      this.$emit('update:defaultValue', this.defaultValue)
    },
    createSlug(title) {
      let slug = utils.convertExpressionToSlug(title)
      if (slug !== '') {
        const slugOccurrences = this.slugs.filter(singleSlug => singleSlug.indexOf(`${slug}-`) > -1).length
        if (slugOccurrences > 0) {
          slug += `-${slugOccurrences + 1}`
        }
      }
      this.level.slug = slug
      this.forceRenderKeySlug += 1
    },
    async onSubmit() {
      (this.level.id ? this.update({ id: this.level.id, level: this.level }) : this.create(this.level)).then(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.level.id ? this.$t('#ToastMessage #Success Edit') : this.$t('#ToastMessage #Success Save'),
            icon: this.level.id ? 'EditIcon' : 'SaveIcon',
            variant: 'success',
          },
        }, {
          timeout: 2000,
          draggable: true,
          hideProgressBar: false,
        })
        this.$emit('update:active', false)
      })
    },
  },
}
</script>

<style scoped>

</style>