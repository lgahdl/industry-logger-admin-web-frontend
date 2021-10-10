import httpClient from '@/services/http-client/telos.http-client'

const baseUrl = 'level'

export default class LevelService {
  static async findBySeriesId(seriesId, page, limit, search) {
    const { data } = await httpClient.get([baseUrl, 'seriesId', seriesId].join('/'), {
      params: {
        page,
        limit,
        search,
      },
    })
    return data
  }

  static async findById(id) {
    const { data } = await httpClient.get([baseUrl, id].join('/'))
    return data
  }

  static async create(level) {
    const { data } = await httpClient.post(baseUrl, level)
    return data
  }

  static async update(id, level) {
    const { data } = await httpClient.patch([baseUrl, id].join('/'), level)
    return data
  }

  static async softDelete(id) {
    const { data } = await httpClient.delete([baseUrl, id].join('/'))
    return data
  }
}