import TableFieldService from '@/services/table-field.service'

export default {
  namespaced: true,
  state: {
    tableFields: [],
  },
  getters: {
    tableFields(state) {
      return state.tableFields
    },
  },
  mutations: {
    SET_TABLE_FIELDS(state, tableFields) {
      state.tableFields = tableFields
    },
    CREATE_TABLE_FIELD(state, tableField) {
      state.tableFields.push(tableField)
    },
    UPDATE_TABLE_FIELD(state, updatedTableField) {
      const index = state.tableFields.findIndex(({ id }) => id === updatedTableField.id)
      Object.assign(state.tableFields[index], updatedTableField)
    },
    DELETE_TABLE_FIELD(state, deletedId) {
      const index = state.tableFields.findIndex(({ id }) => id === deletedId)
      state.tableFields.splice(index, 1)
    },
  },
  actions: {
    async findByIdTable(ctx, idTable) {
      const { commit } = ctx
      const tableFields = await TableFieldService.findByIdTable(idTable)
      commit('SET_TABLE_FIELDS', tableFields)
      return tableFields
    },
    async create(ctx, tableField) {
      const { commit } = ctx
      const savedTableField = await TableFieldService.create(tableField)
      commit('CREATE_TABLE_FIELD', savedTableField)
      return savedTableField
    },
    async update(ctx, { id, tableField }) {
      const { commit } = ctx
      const updatedTableField = await TableFieldService.update(id, tableField)
      commit('UPDATE_TABLE_FIELD', updatedTableField)
      return updatedTableField
    },
    async delete(ctx, id) {
      const { commit } = ctx
      await TableFieldService.delete(id)
      commit('DELETE_TABLE_FIELD')
    },
  },
}