import httpClient from '@/services/http-client/telos.http-client'

const baseUrl = 'category'

export default class CategoryService {
  static async findAll(page, limit, search) {
    const { data } = await httpClient.get(baseUrl, { params: { page, limit, search } })
    return data
  }
}