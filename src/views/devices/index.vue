<template>
  <div>
    <b-button
      v-b-modal.modal-create
      class="mb-1"
    >
      Adicionar Dispositivo
    </b-button>
    <b-table
      :items="devices"
      :fields="columns"
    />
    <b-modal
      id="modal-create"
      #default="{hide}"
      title="Adicionar Dispositivo"
      hide-footer
      size="lg"
    >
      <validation-observer
        #default="{handleSubmit}"
        ref="refFormObserver"
      >
        <b-form
          @submit.prevent="handleSubmit(onSubmitCreate)"
          @reset.prevent="resetForm"
        >
          <b-row>
            <b-col
              cols="12"
              md="6"
            >
              <form-input
                v-model="deviceToCreate.name"
                title="Nome"
                name="Nome"
                rules="required"
              />
            </b-col>
            <b-col
              cols="12"
              md="6"
            >
              <form-input
                v-model="deviceToCreate.macAddress"
                title="Mac Address"
                name="Mac Address"
                rules="required"
                :cleave-options="cleaveOptions.macAddress"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="6" />
            <b-col cols="3">
              <save-button style="width:100%" />
            </b-col>
            <b-col cols="3">
              <cancel-button
                style="width:100%"
                @click="hide"
              />
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import cleaveOptions from '@/libs/cleave/options'

export default {
  name: 'Devices',
  data() {
    return {
      cleaveOptions,
      columns: [
        { key: 'id', sortable: true },
        {
          key: 'name', sortable: true,
        },
        {
          key: 'macAddress', sortable: false,
        },
        {
          key: 'createdAt', sortable: false,
        },
        {
          key: 'updatedAt', sortable: false,
        },
        {
          key: 'actions', sortable: false,
        },
      ],
      deviceToCreate: {},
      deviceToUpdate: {},
    }
  },
  computed: {
    ...mapGetters({ devices: 'devices/devices' }),
  },
  beforeMount() {
    this.findAll()
  },
  methods: {
    ...mapActions({ findAll: 'devices/findAll' }),
    onSubmitCreate() {
      console.log(this.deviceToCreate)
    },
  },
}
</script>

<style scoped>

</style>