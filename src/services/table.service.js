import httpClient from '@/services/http-client'

const baseUrl = 'table'

export default class DeviceService {
  static async findById(id) {
    const { data } = await httpClient.get([baseUrl, id].join('/'))
    return data
  }

  static async findByIdDevice(idDevice) {
    const { data } = await httpClient.get([baseUrl, 'device', idDevice].join('/'))
    return data
  }

  static async create(table) {
    const { data } = await httpClient.post(baseUrl, table)
    return data
  }

  static async update(id, table) {
    const { data } = await httpClient.patch([baseUrl, id].join('/'), table)
    return data
  }

  static async delete(id) {
    const { data } = await httpClient.delete([baseUrl, id].join('/'))
    return data
  }
}