import httpClient from './http-client/telos.http-client'

const baseUrl = 'series'

export default class SeriesService {
  static async findAll(page, limit, search) {
    const { data } = await httpClient.get(baseUrl, { params: { page, limit, search } })
    return data
  }

  static async findOne(id) {
    const { data } = await httpClient.get([baseUrl, id].join('/'))
    return data
  }

  static async create(series) {
    const { data } = await httpClient.post(baseUrl, series)
    return data
  }

  static async update(id, series) {
    const { data } = await httpClient.patch([baseUrl, id].join('/'), series)
    return data
  }

  static async softDelete(id) {
    const { data } = await httpClient.delete([baseUrl, id].join('/'))
    return data
  }
}