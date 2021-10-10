import httpClient from '@/services/http-client'

const baseUrl = 'log'

export default class LogService {
  static async findAll(page, limit, search) {
    const { data } = await httpClient.get(baseUrl, { params: { page, limit, search } })
    return data
  }

  static async create(content) {
    const { data } = await httpClient.post(baseUrl, content)
    return data
  }

  static async update(id, content) {
    const { data } = await httpClient.patch([baseUrl, id].join('/'), content)
    return data
  }

  static async softDelete(id) {
    const { data } = await httpClient.delete([baseUrl, id].join('/'))
    return data
  }
}