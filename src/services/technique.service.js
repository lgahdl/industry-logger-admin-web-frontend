import httpClient from './http-client/telos.http-client'

const baseUrl = 'technique'

export default class TechniqueService {
  static async findAll(page, limit, search) {
    const { data } = await httpClient.get(baseUrl, { params: { page, limit, search } })
    return data
  }
}