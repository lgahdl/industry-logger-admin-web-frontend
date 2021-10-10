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
            <form-select
              v-model="series.category"
              :name="$t('#Series #FormInputTitle Category')"
              :title="$t('#Series #FormInputTitle Category')"
              :options="categories"
              rules="required"
              :label="`languages.${$i18n.locale}.title`"
              taggable
              :reduce="value=>value"
              :create-options="text=> ({languages:{[$i18n.locale]:{title: text}}})"
              :placeholder="$t('#Series #FormInputPlaceholder Category')"
              :search="searchCategory"
            />
            <form-input
              id="title"
              v-model="series.languages[$i18n.locale].title"
              :name="$t('#Series #FormInputTitle Title')"
              :rules="{required:true, noRepeated: filteredTitles}"
              :title="$t('#Series #FormInputTitle Title')"
              :placeholder="$t('#Series #FormInputPlaceholder Title')"
              @change="handleTitleChange"
            />
            <form-input
              id="title"
              :key="forceRenderKey2"
              v-model="series.slug"
              disabled
              :name="$t('#Series #FormInputTitle Slug')"
              :title="$t('#Series #FormInputTitle Slug')"
              :placeholder="$t('#Series #FormInputPlaceholder Slug')"
            />
            <form-input
              id="description"
              v-model="series.languages[$i18n.locale].description"
              :name="$t('#Series #FormInputTitle Description')"
              rules="required"
              :title="$t('#Series #FormInputTitle Description')"
              :placeholder="$t('#Series #FormInputPlaceholder Description')"
            />
            <form-select
              v-model="series.parentalRating"
              :name="$t('#Series #FormInputTitle Parental Rating')"
              :title="$t('#Series #FormInputTitle Parental Rating')"
              :options="parentalRatings"
              rules="required"
              label="label"
              :reduce="value=>value.value"
              :create-option="text=>({value:text, label: text})"
              :placeholder="$t('#Series #FormInputPlaceholder Parental Rating')"
            />
            <validation-provider
              #default="validationContext"
              name="Description"
            >
              <b-form-group
                :label="$t('#Series #FormInputTitle Price')"
                label-for="description"
              >
                <b-input-group
                  style="width:100%; height:38px; border-radius: 13px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);"
                >
                  <template
                    #prepend
                  >
                    <b-input-group-text
                      style="border-bottom-left-radius:13px; border-top-left-radius: 13px;
                  border: none !important;"
                    >
                      {{ $t("#General #Miscellaneous Currency") }}
                    </b-input-group-text>
                  </template>
                  <b-form-input
                    v-model="series.price"
                    v-cleave="cleaveOptions.decimal"
                    style="height:100%; border-bottom-right-radius:13px;
                           border-top-right-radius: 13px; border: none !important;
                           box-shadow: none !important"
                    :state="getValidationState(validationContext)"
                    class="d-inline-block"
                    :placeholder="$t('#Placeholder Currency Value')"
                  />
                </b-input-group>
                <div style="height:29px">
                  <b-form-invalid-feedback>
                    {{ validationContext.errors[0] }}
                  </b-form-invalid-feedback>
                </div>
              </b-form-group>
            </validation-provider>
            <form-date
              v-model="series.releasedAt"
              :name="$t('#Series #FormInputTitle Released Date')"
              :label="$t('#Series #FormInputTitle Released Date')"
              :get-validation-state="getValidationState"
            />
            <validation-provider
              #default="validationContext"
              name="Cover Image"
            >
              <b-form-group
                :label="$t('#Series #FormInputTitle Cover Image')"
                label-for="assetsFieldHandle"
              >
                <div
                  class="file-input-container"
                  @dragover="dragOverCoverImage"
                  @dragleave="dragLeaveCoverImage"
                  @drop="dropCoverImage"
                >
                  <img
                    :src="require('@/assets/images/misc/file-cloud.png')"
                    style="width:64px; height:48px"
                    class="mr-1"
                  >
                  <div class="pt-2 d-flex flex-column align-items-center">
                    <input
                      v-show="false"
                      id="assetsFieldHandle"
                      ref="coverImageFileInput"
                      type="file"
                      class="w-px h-px opacity-0 overflow-hidden absolute"
                      accept=".jpg,.jpeg,.png"
                      @change="onChangeCoverImage()"
                    >
                    <label
                      for="assetsFieldHandle"
                      class="block cursor-pointer btn-outline-primary align-items-center justify-content-center d-flex p-1"
                      style="height:38px"
                    >
                      <template v-if="!coverImageFile">
                        <feather-icon
                          class="mr-1"
                          icon="FolderIcon"
                        />
                        {{ $t("#Button Select File") }}
                      </template>
                      <template v-else>
                        <feather-icon
                          class="mr-1"
                          icon="RefreshCwIcon"
                        />
                        {{ $t("#Button Replace File") }}
                      </template>
                    </label>
                    <span class="undermessage-error">{{ validationContext.errors[0] }}</span>
                    <span class="undermessage">{{ coverImageFile ? coverImageFile.name : "" }}</span>
                  </div>
                </div>
              </b-form-group>
            </validation-provider>
            <form-select
              v-model="series.techniques"
              :name="$t('#Series #FormInputTitle Techniques')"
              :title="$t('#Series #FormInputTitle Techniques')"
              :options="techniques"
              rules="required"
              :label="`languages.${$i18n.locale}.title`"
              multiple
              push-tags
              taggable
              :create-options="text=> ({languages:{[$i18n.locale]:{title: text}}})"
              :reduce="value=>value"
              :placeholder="$t('#Series #FormInputPlaceholder Techniques')"
            />
            <form-select
              v-model="series.skills"
              :name="$t('#Series #FormInputTitle Skills')"
              :title="$t('#Series #FormInputTitle Skills')"
              :options="skills"
              rules="required"
              :label="`languages.${$i18n.locale}.title`"
              multiple
              push-tags
              taggable
              :create-options="text=> ({languages:{[$i18n.locale]:{title: text}}})"
              :reduce="value=>value"
              :placeholder="$t('#Series #FormInputPlaceholder Skills')"
              :search="searchSkills"
            />
            <form-select
              v-model="series.attitudes"
              :name="$t('#Series #FormInputTitle Attitudes')"
              :title="$t('#Series #FormInputTitle Attitudes')"
              :options="attitudes"
              rules="required"
              :label="`languages.${$i18n.locale}.title`"
              multiple
              push-tags
              taggable
              :create-options="text=> ({languages:{[$i18n.locale]:{title: text}}})"
              :reduce="value=>value"
              :placeholder="$t('#Series #FormInputPlaceholder Attitudes')"
              :search="searchAttitude"
            />
            <form-select
              v-model="series.sdgIndicators"
              :name="$t('#Series #FormInputTitle SDGIndicators')"
              :title="$t('#Series #FormInputTitle SDGIndicators')"
              :options="sdgIndicators"
              rules="required"
              :label="`languages.${$i18n.locale}.title`"
              multiple
              :reduce="value=>value"
              :placeholder="$t('#Series #FormInputPlaceholder SDGIndicators')"
              :search="searchSdgIndicators"
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
import cleaveOptions from '@/libs/cleave/options'
import formValidation from '@core/comp-functions/forms/form-validation'
import {
  reactive, ref, toRefs, watch,
} from '@vue/composition-api'
import _ from 'lodash'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import UploadFileService from '@/services/upload-file.service'
import utils from '@/helpers/utils'

export default {
  name: 'IndexVue',
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    defaultValue: {
      type: undefined,
      required: false,
      default: undefined,
    },
  },
  beforeMount() {
    this.$store.dispatch('attitude/findAll', { page: 1, limit: 20, search: '' })
    this.$store.dispatch('skill/findAll', { page: 1, limit: 20, search: '' })
    this.$store.dispatch('category/findAll', { page: 1, limit: 20, search: '' })
    this.$store.dispatch('sdgIndicator/findAll', { page: 1, limit: 20, search: '' })
    this.$store.dispatch('technique/findAll', { page: 1, limit: 20, search: '' })
  },
  setup(props, { root, emit }) {
    // ATTITUDE
    const attitudeStore = createNamespacedHelpers('attitude')

    const { attitudes, pagination: attitudePagination } = attitudeStore.useGetters(['attitudes', 'pagination'])

    const { findAll: attitudeFindAll } = attitudeStore.useActions(['findAll'])

    // CATEGORY
    const categoryStore = createNamespacedHelpers('category')

    const { categories, pagination: categoryPagination } = categoryStore.useGetters(['categories', 'pagination'])

    const { findAll: categoryFindAll } = categoryStore.useActions(['findAll'])

    // SDG INDICATORS
    const sdgIndicatorStore = createNamespacedHelpers('sdgIndicator')

    const {
      sdgIndicators,
      pagination: sdgIndicatorPagination,
    } = sdgIndicatorStore.useGetters(['sdgIndicators', 'pagination'])

    const { findAll: sdgIndicatorFindAll } = sdgIndicatorStore.useActions(['findAll'])

    // SERIES
    const seriesStore = createNamespacedHelpers('series')

    const {
      seriesSecondInstance: allSeries,
      pagination: seriesPagination,
    } = seriesStore.useGetters(['seriesSecondInstance', 'pagination'])

    const { findAll: seriesFindAll, create, update } = seriesStore.useActions(['findAll', 'create', 'update'])
    // SKILL

    const skillStore = createNamespacedHelpers('skill')

    const { skills, pagination: skillPagination } = skillStore.useGetters(['skills', 'pagination'])

    const { findAll: skillFindAll } = skillStore.useActions(['findAll'])

    // TECHNIQUE

    const techniqueStore = createNamespacedHelpers('technique')
    const {
      techniques,
      pagination: techniquePagination,
    } = techniqueStore.useGetters(['techniques', 'pagination'])
    const { findAll: techniqueFindAll } = techniqueStore.useActions(['findAll'])

    const afterSuggestions = ref(null)

    const coverImageFileInput = ref(null)

    const coverImageFile = ref(null)
    const state = reactive({
      series: {
        category: null,
        languages: {
          [root.$i18n.locale]: { title: '', description: '' },
        },
        price: '',
        coverImageUrl: '',
        techniques: [],
        skills: [],
        attitudes: [],
        sdgIndicators: [],
      },
      allSeries: _.cloneDeep(allSeries),
      seriesPagination: _.cloneDeep(seriesPagination),
      attitudes: _.cloneDeep(attitudes),
      attitudePagination: _.cloneDeep(attitudePagination),
      timer: undefined,
      categories: _.cloneDeep(categories),
      categoryPagination: _.cloneDeep(categoryPagination),
      skills: _.cloneDeep(skills),
      skillPagination: _.cloneDeep(skillPagination),
      techniques: _.cloneDeep(techniques),
      techniquePagination: _.cloneDeep(techniquePagination),
      sdgIndicators: _.cloneDeep(sdgIndicators),
      sdgIndicatorPagination: _.cloneDeep(sdgIndicatorPagination),
    })

    const forceRenderKey = ref(0)
    const forceRenderKey2 = ref(0)

    watch(() => props.defaultValue, value => {
      if (value) {
        state.series = value
      } else {
        state.series = {
          category: null,
          languages: {
            [root.$i18n.locale]: { title: '', description: '' },
          },
          price: '',
          coverImageUrl: '',
          techniques: [],
          skills: [],
          attitudes: [],
          sdgIndicators: [],
        }
      }
      forceRenderKey.value += 1
    })

    const parentalRatings = [
      { value: '0', label: root.$t('#FormSelectOption #ParentalRating 0') },
      { value: '10', label: root.$t('#FormSelectOption #ParentalRating 10') },
      { value: '12', label: root.$t('#FormSelectOption #ParentalRating 12') },
      { value: '14', label: root.$t('#FormSelectOption #ParentalRating 14') },
      { value: '16', label: root.$t('#FormSelectOption #ParentalRating 16') },
      { value: '18', label: root.$t('#FormSelectOption #ParentalRating 18') },
    ]

    // COVER IMAGE
    const onChangeCoverImage = () => {
      [coverImageFile.value] = coverImageFileInput.value.files
    }

    const dragOverCoverImage = event => {
      event.preventDefault()
      // Add some visual fluff to show the user can drop its files
      if (!event.currentTarget.classList.contains('bg-green-300')) {
        event.currentTarget.classList.remove('bg-gray-100')
        event.currentTarget.classList.add('bg-green-300')
      }
    }

    const dragLeaveCoverImage = event => {
      // Clean up
      event.currentTarget.classList.add('bg-gray-100')
      event.currentTarget.classList.remove('bg-green-300')
    }
    const dropCoverImage = event => {
      event.preventDefault()
      coverImageFileInput.file.files = event.dataTransfer.files
      onChangeCoverImage() // Trigger the onChange event manually
      // Clean up
      event.currentTarget.classList.add('bg-gray-100')
      event.currentTarget.classList.remove('bg-green-300')
    }

    // FORM
    const onSubmit = async () => {
      if (coverImageFile.value) {
        const filename = await UploadFileService.uploadFile(coverImageFile.value)
        state.series.coverImageFile = filename
      }
      await (state.series.id ? update({ id: state.series.id, series: state.series }) : create(state.series))
      root.$toast({
        component: ToastificationContent,
        props: {
          title: state.series.id ? root.$t('#ToastMessage #Success Edit') : root.$t('#ToastMessage #Success Save'),
          icon: state.series.id ? 'EditIcon' : 'SaveIcon',
          variant: 'success',
        },
      }, {
        timeout: 2000,
        draggable: true,
        hideProgressBar: false,
      })
      emit('update:active', false)
    }

    const resetSerie = () => {
      state.series = {
        area: { title: '' },
        title: '',
        description: '',
        price: '',
        coverImageUrl: '',
        techniques: [],
        skills: [],
        attitudes: [],
        sdgIndicators: [],
      }
    }

    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation(resetSerie)

    const searchAttitude = text => {
      clearTimeout(state.timer)
      state.timer = setTimeout(() => {
        state.attitudePagination.search = text
        attitudeFindAll(state.attitudePagination)
      }, 500)
    }

    const searchCategory = text => {
      clearTimeout(state.timer)
      state.timer = setTimeout(() => {
        state.categoryPagination.search = text
        categoryFindAll(state.categoryPagination)
      }, 500)
    }

    const searchSeries = text => {
      clearTimeout(state.timer)
      state.timer = setTimeout(() => {
        const pagination = {
          search: text, page: 1, limit: 1000, instance: 2,
        }
        seriesFindAll(pagination)
      })
    }

    const filteredTitles = ref([])
    watch(allSeries,
      allSeriesNewValue => {
        if (allSeriesNewValue && allSeriesNewValue.length > 0) {
          const languagesArrayOfArrays = allSeriesNewValue.map(series => Object.values(series.languages))
          const languagesArray = [].concat(...languagesArrayOfArrays)
          const titlesArray = languagesArray && languagesArray.map(({ title }) => title).filter(value => !!value)
          filteredTitles.value = titlesArray
        }
      })

    const handleTitleChange = text => {
      if (text) {
        searchSeries(text)
      }
      const slug = utils.convertExpressionToSlug(text)
      state.series.slug = slug
      if (slug) {
        forceRenderKey2.value += 1
      }
    }

    const searchSkills = text => {
      clearTimeout(state.timer)
      state.timer = setTimeout(() => {
        state.skillPagination.search = text
        skillFindAll(state.skillPagination)
      }, 500)
    }

    const searchTechniques = text => {
      clearTimeout(state.timer)
      state.timer = setTimeout(() => {
        state.techniquePagination.search = text
        techniqueFindAll(state.techniquePagination)
      }, 500)
    }

    const searchSdgIndicators = text => {
      clearTimeout(state.timer)
      state.timer = setTimeout(() => {
        state.sdgIndicatorPagination.search = text
        sdgIndicatorFindAll(state.sdgIndicatorPagination)
      }, 500)
    }

    return {
      ...toRefs(state),
      coverImageFile,
      // CATEGORY
      categories,
      searchCategory,
      // TITLE
      searchSeries,
      handleTitleChange,
      filteredTitles,
      // COVER IMAGE FILE INPUT
      onChangeCoverImage,
      dragOverCoverImage,
      dragLeaveCoverImage,
      dropCoverImage,
      // TECHNIQUE
      techniques,
      searchTechniques,
      // SKILLS
      skills,
      searchSkills,
      // ATTITUDES
      attitudes,
      searchAttitude,
      // SDG INDICATORS
      sdgIndicators,
      searchSdgIndicators,
      // FORM
      onSubmit,
      refFormObserver,
      getValidationState,
      resetForm,
      // REFS
      afterSuggestions,
      coverImageFileInput,
      // MISC
      cleaveOptions,
      forceRenderKey,
      forceRenderKey2,
      parentalRatings,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-autosuggest.scss';
</style>
