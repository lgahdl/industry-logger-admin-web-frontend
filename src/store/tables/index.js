import TableService from '@/services/table.service.js'

export default {
  namespaced: true,
  state: {
    tables: null,
    table: null,
  },
  getters: {
    tables(state) {
      return state.tables
    },
    table(state) {
      return state.table
    },
  },
  mutations: {
    SET_TABLES(state, tables) {
      state.tables = tables
    },
    SET_TABLE(state, table) {
      state.table = table
    },
    CREATE_TABLE(state, newTable) {
      state.tables.push(newTable)
    },
    UPDATE_TABLE(state, updatedTable) {
      const index = state.tables.findIndex(table => table.id === updatedTable.id)
      Object.assign(state.tables[index], updatedTable)
    },
    DELETE_TABLE(state, deletedTableId) {
      const index = state.tables.findIndex(({ id }) => id === deletedTableId)
      state.tables.splice(index, 1)
    },
  },
  actions: {
    async findByIdDevice(ctx, idDevice) {
      const { commit } = ctx
      const tables = await TableService.findByIdDevice(idDevice)
      commit('SET_TABLES', tables)
      return tables
    },
    async findById(ctx, id) {
      const { commit } = ctx
      const table = await TableService.findById(id)
      commit('SET_TABLE', table)
      return table
    },
    async create(ctx, table) {
      const { commit } = ctx
      const savedTable = await TableService.create(table)
      commit('CREATE_TABLE', savedTable)
      return savedTable
    },
    async update(ctx, { id, table }) {
      const { commit } = ctx
      const updatedTable = await TableService.update(id, table)
      commit('UPDATE_TABLE', updatedTable)
      return updatedTable
    },
    async delete(ctx, id) {
      const { commit } = ctx
      await TableService.delete(id)
      commit('DELETE_TABLE', id)
      return true
    },
  },
}