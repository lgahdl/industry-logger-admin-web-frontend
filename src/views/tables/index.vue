<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <h1
          v-if="device"
          class="d-flex"
        >Tabelas do dispositivo
        </h1>
      </b-card-header>
      <b-card-body>

        <h2
          v-if="device"
          class="py-1"
        >
          Dispositivo: {{ device.name }}
        </h2>
        <b-button
          class="mb-1 py-1"
          @click="createTable"
        >
          Adicionar Tabela
        </b-button>
        <b-table
          :items="tables"
          :fields="columns"
        >
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
                @click="editTable(item)"
              />
              <feather-icon
                class="icon-button mr-1"
                icon="ClipboardIcon"
                size="18"
                @click="editTableFields(item)"
              />
              <feather-icon
                class="icon-button"
                icon="TrashIcon"
                size="18"
                @click="deleteTable(item)"
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
      title="Adicionar Tabela de Valores"
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
                v-model="selectedTable.name"
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
                v-model="selectedTable.description"
                title="Descrição"
                name="Descrição"
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
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'Tables',
  data() {
    return {
      deviceId: null,
      selectedTable: {},
      columns: [
        { key: 'id', sortable: true, label: 'Id' },
        {
          key: 'name', sortable: true, label: 'Nome',
        },
        {
          key: 'description', sortable: false, label: 'Descrição',
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
    }
  },
  computed: {
    ...mapGetters({ tables: 'tables/tables', device: 'devices/device' }),
  },
  beforeMount() {
    this.idDevice = this.$route.params.idDevice
    this.$store.dispatch('tables/findByIdDevice', this.idDevice)
    this.$store.dispatch('devices/findById', this.idDevice)
  },
  methods: {
    async onSubmit() {
      if (this.selectedTable.id) {
        await this.$store.dispatch('tables/update', {
          table: this.selectedTable,
          id: this.selectedTable.id,
        })
      } else {
        await this.$store.dispatch('tables/create', { ...this.selectedTable, idDevice: this.idDevice })
      }
      this.$refs.bModal.hide()
    },
    createTable() {
      this.selectedTable = {}
      this.$refs.bModal.show()
    },
    editTable(table) {
      this.selectedTable = _.cloneDeep(table)
      this.$refs.bModal.show()
    },
    editTableFields(table) {
      this.$router.push({ name: 'table-fields', params: { idTable: table.id, idDevice: this.device.id } })
    },
    deleteTable(table) {
      this.$swal({
        icon: 'warning',
        title: `Deletar tabela ${table.name}?`,
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
          this.$store.dispatch('tables/delete', table.id)
        }
      })
    },
  },
}
</script>

<style scoped>

</style>