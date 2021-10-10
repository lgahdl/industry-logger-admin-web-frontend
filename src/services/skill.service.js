import httpClient from './http-client/telos.http-client'

const baseUrl = 'skill'

export default class SkillService {
  static async findAll(page, limit, search) {
    const { data } = await httpClient.get(baseUrl, { params: { page, limit, search } })
    return data
  }
}