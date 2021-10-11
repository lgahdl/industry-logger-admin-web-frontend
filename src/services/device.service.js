import httpClient from '@/services/http-client'

const baseUrl = 'device'

export default class DeviceService {
  static async findById(id) {
    const { data } = await httpClient.get([baseUrl, id].join('/'))
    return data
  }

  static async findAll(page, limit, search) {
    const { data } = await httpClient.get(baseUrl, { params: { page, limit, search } })
    return data
  }

  static async create(device) {
    const { data } = await httpClient.post(baseUrl, device)
    return data
  }

  static async update(id, device) {
    const { data } = await httpClient.patch([baseUrl, id].join('/'), device)
    return data
  }

  static async delete(id) {
    const { data } = await httpClient.delete([baseUrl, id].join('/'))
    return data
  }
}