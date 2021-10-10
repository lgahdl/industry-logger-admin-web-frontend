<template>
  <div>
    <validation-observer
      #default="{handleSubmit}"
      ref="refFormObserver"
    >
      <b-form @submit.prevent="handleSubmit(onSubmit)">
        <form-select
          v-model="content.type"
          :name="$t('#Content #FormInputTitle Type')"
          :title="$t('#Content #FormInputTitle Type')"
          :options="types"
          rules="required"
          label="label"
          :reduce="value=>value.value"
          :placeholder="$t('#Content #FormInputPlaceholder Type')"
        />
        <span
          style="color:#a4a4a4;position:relative; top:-15px"
        >
          {{ $t("#Content #FormInputWarning Type") }}
        </span>
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
export default {
  name: 'TypeStep',
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
  computed: {
    types() {
      return [
        { label: this.$t('#Enums #TypeEnum video'), value: 'video' },
        // { label: this.$t('#Enums #TypeEnum exercise'), value: 'exercise' }, TEMP REMOVED
        { label: this.$t('#Enums #TypeEnum ebook'), value: 'ebook' },
      ]
    },
  },
}
</script>

<style scoped>

</style>