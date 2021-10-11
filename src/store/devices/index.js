import DeviceService from '@/services/device.service'

export default {
  namespaced: true,
  state: {
    devices: [],
  },
  getters: {
    devices(state) {
      return state.devices
    },
  },
  mutations: {
    UPDATE_DEVICES(state, devices) {
      state.devices = devices
    },
    SAVE_DEVICE(state, saved) {
      state.devices.push(saved)
    },
    UPDATE_DEVICE(state, updated) {
      const index = state.devices.findIndex(({ id }) => id === updated.id)
      Object.assign(state.devices[index], updated)
    },
    DELETE_DEVICE(state, deletedId) {
      const index = state.devices.findIndex(({ id }) => id === deletedId)
      state.devices.splice(index, 1)
    },
  },
  actions: {
    async findAll(ctx) {
      const { commit } = ctx
      const devices = await DeviceService.findAll()
      commit('UPDATE_DEVICES', devices)
      return devices
    },
    async create(ctx, device) {
      const { commit } = ctx
      const savedDevice = await DeviceService.create(device)
      commit('SAVE_DEVICE', savedDevice)
      return savedDevice
    },
    async update(ctx, { id, device }) {
      const { commit } = ctx
      const updatedDevice = await DeviceService.update(id, device)
      commit('UPDATE_DEVICE', updatedDevice)
      return updatedDevice
    },
    async delete(ctx, id) {
      const { commit } = ctx
      await DeviceService.delete(id)
      commit('DELETE_DEVICE', id)
    },
  },
}