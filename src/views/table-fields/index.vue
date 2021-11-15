<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <h1
          class="d-flex"
        >Campos da tabela
        </h1>
      </b-card-header>
      <b-card-body>
        <h2
          v-if="device"
          class="py-1"
        >
          Dispositivo: {{ device.name }}
        </h2>
        <h2
          v-if="table"
          class="py-1"
        >
          Tabela: {{ table.name }}
        </h2>
        <b-button
          class="mb-1 py-1"
          @click="createTableField"
        >
          Adicionar Campo
        </b-button>
        <b-table
          :items="tableFields"
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
                @click="editTableField(item)"
              />
              <feather-icon
                class="icon-button"
                icon="TrashIcon"
                size="18"
                @click="deleteTableField(item)"
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
                v-model="selectedTableField.name"
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
                v-model="selectedTableField.description"
                title="Descrição"
                name="Descrição"
              />
            </b-col>
            <b-col
              cols="12"
              md="6"
            >
              <form-input
                v-model="selectedTableField.prepend"
                title="Prefixo"
                name="Prefixo"
              />
            </b-col>
            <b-col
              cols="12"
              md="6"
            >
              <form-input
                v-model="selectedTableField.append"
                title="Sufixo"
                name="Sufixo"
              />
            </b-col>
            <b-col
              cols="12"
            >
              <form-select
                v-model="selectedTableField.type"
                label="label"
                title="Tipo do campo"
                name="type"
                :reduce="(item)=>item.value"
                :options="typeOptions"
                rules="required"
              />
            </b-col>
            <b-col
              cols="12"
              md="6"
            >
              <div

                class="mt-3"
                style="width:100%;"
              >
                <label>
                  Registrador
                </label>
                <b-form-spinbutton
                  v-model="registerNumber"
                  style="max-width:100vw;"
                  :min="0"
                  wrap
                  :max="Math.trunc(10000/16)-1"
                  rules="required"
                />
              </div>
            </b-col>
            <b-col
              v-if="selectedTableField.type === 'BOOLEAN' || selectedTableField.type==='ALARM'"
              cols="12"
              md="6"
            >
              <div
                class="mt-3"
                style="width:100%;"
              >
                <label>
                  Bit
                </label>
                <b-form-spinbutton
                  v-model="digitNumber"
                  style="max-width:100vw;"
                  :min="0"
                  wrap
                  :max="15"
                />
              </div>
            </b-col>
            <b-col
              v-if="selectedTableField.type === 'FLOAT'"
              cols="12"
              md="6"
            >
              <div
                class="mt-3"
                style="width:100%;"
              >
                <label>
                  Casas decimais
                </label>
                <b-form-spinbutton
                  v-model="selectedTableField.decimalDigits"
                  style="max-width:100vw;"
                  :min="1"
                  wrap
                  :max="4"
                />
              </div>
            </b-col>
            <b-col
              cols="12"
              md="6"
            >
              <div
                class="mt-3"
                style="width:100%;"
              >
                <label>
                  Valor Exemplo:
                </label>
                <div
                  class="d-flex align-items-center justify-content-center"
                  style="height:38px; border-radius: 7px; width:100%; border: 1px solid rgba(0,0,0,0.15)"
                >

                  <span>
                    {{ selectedTableField.prepend }} {{
                      getExampleValue(selectedTableField)
                    }} {{ selectedTableField.append }}
                  </span>
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row class="py-2">
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
  name: 'TableFields',
  data() {
    return {
      idTable: null,
      idDevice: null,
      selectedTableField: null,
      registerNumber: 0,
      digitNumber: 0,
      typeOptions: [
        { label: 'INTEGER', value: 'INTEGER' },
        { label: 'FLOAT', value: 'FLOAT' },
        { label: 'BOOLEAN', value: 'BOOLEAN' },
        { label: 'ALARM', value: 'ALARM' },
      ],
      columns: [
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
    ...mapGetters({ tableFields: 'tableFields/tableFields', device: 'devices/device', table: 'tables/table' }),
  },
  beforeMount() {
    const { idDevice, idTable } = this.$route.params
    this.idDevice = idDevice
    this.idTable = idTable
    this.$store.dispatch('devices/findById', idDevice)
    this.$store.dispatch('tables/findById', idTable)
    this.$store.dispatch('tableFields/findByIdTable', idTable)
  },
  methods: {
    getExampleValue(tableField) {
      if (tableField.type === 'FLOAT') {
        return ['65000'.substring(0, 5 - tableField.decimalDigits), '.', '65000'.substring(5 - tableField.decimalDigits, 5)].join('')
      }
      if (tableField.type === 'INTEGER') {
        return '65000'
      }
      return '1'
    },
    async onSubmit() {
      if (this.selectedTableField.type === 'FLOAT' || this.selectedTableField.type === 'INTEGER') {
        this.digitNumber = 0
      }
      this.selectedTableField.logDigit = this.registerNumber * 16 + this.digitNumber
      if (this.selectedTableField.id) {
        await this.$store.dispatch('tableFields/update', {
          tableField: this.selectedTableField,
          id: this.selectedTableField.id,
        })
      } else {
        await this.$store.dispatch('tableFields/create', { ...this.selectedTableField, idTable: this.idTable })
      }
      this.$refs.bModal.hide()
    },
    createTableField() {
      this.registerNumber = 0
      this.selectedTableField = { decimalDigits: 1 }
      this.$refs.bModal.show()
    },
    editTableField(tableField) {
      this.selectedTableField = _.cloneDeep(tableField)
      this.registerNumber = Math.trunc(tableField.logDigit / 16)
      this.digitNumber = tableField.logDigit % 16
      this.$refs.bModal.show()
    },
    deleteTableField(tableField) {
      this.$swal({
        icon: 'warning',
        title: `Deletar campo ${tableField.name}?`,
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
          this.$store.dispatch('tableFields/delete', tableField.id)
        }
      })
    },
  },

}
</script>

<style scoped>

</style>