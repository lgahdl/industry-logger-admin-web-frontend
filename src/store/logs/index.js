import LogService from '@/services/log.service'

export default {
  namespaced: true,
  state: {
    logs: [],
    lastLog: null,
  },
  getters: {
    logs(state) {
      return state.logs
    },
    lastLog(state) {
      return state.lastLog
    },
  },
  mutations: {
    UPDATE_LOGS(state, logs) {
      state.logs = logs
    },
    UPDATE_LAST_LOG(state, lastLog) {
      state.lastLog = lastLog
    },
    DELETE_LOGS(state, finalDate) {
      const logs = state.logs.map(({ createdAt }) => createdAt < finalDate)
      state.logs = logs
    },
  },
  actions: {
    async findAll(ctx, { macAddress, initialDate, finalDate }) {
      const { commit } = ctx
      const logs = await LogService.findAll(macAddress, initialDate, finalDate)
      commit('UPDATE_LOGS', logs)
      return logs
    },
    async findLast(ctx, macAddress) {
      const { commit } = ctx
      const lastLog = await LogService.findLast(macAddress)
      commit('UPDATE_LAST_LOG', lastLog)
      return lastLog
    },
    async delete(ctx, { macAddress, finalDate }) {
      const { commit } = ctx
      await LogService.delete(macAddress, finalDate)
      commit('DELETE_LOGS', finalDate)
    },
  },
}