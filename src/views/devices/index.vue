<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <h1
          class="d-flex"
        >Dispositivos
        </h1>
      </b-card-header>
      <b-card-body>

        <b-button
          class="mb-1"
          @click="createDevice"
        >
          Adicionar Dispositivo
        </b-button>
        <b-table
          :items="devices"
          :fields="columns"
        >
          <template #cell(editTable)="{item}">
            <div class="d-flex">
              <feather-icon
                class="icon-button mr-1"
                icon="ClipboardIcon"
                size="18"
                @click="editTables(item)"
              />
            </div>
          </template>
          <template #cell(createdAt)="{item}">
            {{ new Date(item.createdAt).toISOString().split("T")[0] }}
          </template>
          <template #cell(updatedAt)="{item}">
            {{ new Date(item.updatedAt).toISOString().split("T")[0] }}
          </template>
          <template #cell(actions)="{item}">
            <div class="d-flex">
              <feather-icon
                class="icon-button mr-1"
                icon="EditIcon"
                size="18"
                @click="editDevice(item)"
              />
              <feather-icon
                class="icon-button"
                icon="TrashIcon"
                size="18"
                @click="deleteDevice(item)"
              />
            </div>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
    <b-modal
      id="modal"
      ref="bModal"
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
          @submit.prevent="handleSubmit(onSubmit)"
        >
          <b-row>
            <b-col
              cols="12"
              md="6"
            >
              <form-input
                v-model="selectedDevice.name"
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
                v-model="selectedDevice.macAddress"
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
import _ from 'lodash'

export default {
  name: 'Devices',
  data() {
    return {
      cleaveOptions,
      columns: [
        {
          key: 'editTable', sortable: true, label: 'Tabelas',
        },
        {
          key: 'name', sortable: true, label: 'Nome',
        },
        {
          key: 'macAddress', sortable: false, label: 'Endereço MAC',
        },
        {
          key: 'createdAt', sortable: false, label: 'Criado em',
        },
        {
          key: 'updatedAt', sortable: false, label: 'Última Atualização',
        },
        {
          key: 'actions', sortable: false, label: 'Ações',
        },
      ],
      selectedDevice: {},
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
    async onSubmit() {
      if (this.selectedDevice.id) {
        await this.$store.dispatch('devices/update', { device: this.selectedDevice, idDevice: this.selectedDevice.id })
      } else {
        await this.$store.dispatch('devices/create', this.selectedDevice)
      }
      this.$refs.bModal.hide()
    },
    createDevice() {
      this.selectedDevice = {}
      this.$refs.bModal.show()
    },
    editDevice(device) {
      this.selectedDevice = _.cloneDeep(device)
      this.$refs.bModal.show()
    },
    editTables(device) {
      this.$router.push({ name: 'tables', params: { idDevice: device.id } })
    },
    deleteDevice(device) {
      this.$swal({
        icon: 'warning',
        title: `Deletar dispositivo ${device.name}?`,
        html: 'Você tem certeza?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-secondary color-secondary',
          cancelButton: 'btn btn-danger ml-1',
        },
      }).then(result => {
        if (result.isConfirmed) {
          this.$store.dispatch('devices/delete', device.id)
        }
      })
    },
  },
}
</script>

<style scoped>

</style>