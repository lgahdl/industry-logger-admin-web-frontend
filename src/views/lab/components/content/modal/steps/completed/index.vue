<template>
  <div>
    <div
      v-if="content.type==='video'"
      class="py-2 d-flex flex-column justify-content-center"
    >
      <b-embed
        type="iframe"
        aspect="16by9"
        :src="content.files[0].fileUrl"
        allowfullscreen="true"
      />
    </div>
    <div
      v-if="content.type==='ebook'"
      class="py-2 d-flex flex-column justify-content-center align-items-center"
    >
      <a
        target="_blank"
        :href="content.files[0].fileUrl"
        class="d-flex flex-column text-align-center align-items-center justify-content-center font-weight-bolder"
      >
        <feather-icon
          icon="FileTextIcon"
          size="35"
        />
        {{ $t("#Content #Miscellaneous Open File") }}
      </a>
    </div>
    <div class="d-flex flex-column pb-2">
      <hr>
      <h2>{{ content.languages[$i18n.locale].title }}</h2>
      <p
        v-if="content.languages[$i18n.locale].description"
        v-html-safe="content.languages[$i18n.locale].description"
        class="card-text pt-1"
      />
      <span class="d-flex flex-row justify-content-between pt-1">
        {{ $t("#Content #FormInputTitle Slug") }} :
        <h5 class="ml-1">
          {{ content.slug }}
        </h5>
      </span>
      <span class="d-flex flex-row justify-content-between">
        {{ $t("#Content #Miscellaneous File Type") }} :
        <h5>
          {{
            $t("#Noun File")
          }} {{
            content.files[0].filename.substring(content.files[0].filename.lastIndexOf('.') + 1).toUpperCase()
          }}</h5>
      </span>
      <span class="d-flex flex-row justify-content-between">
        {{ $t("#Content #Miscellaneous Content Type") }} :
        <h5>{{
          $t(`#Enums #TypeEnum ${ content.type }`)
        }}</h5>
      </span>
    </div>
    <div class="d-flex flex-row-reverse">
      <custom-button
        title="OK"
        class="px-1"
        style="width: max-content; height:42px"
        variant="secondary"
        icon="CheckIcon"
        @click="onSubmit"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompletedStep',
  props: {
    onSubmit: {
      type: Function,
      required: true,
    },
    content: {
      type: undefined,
      required: true,
    },
  },
}
</script>

<style scoped>

</style>