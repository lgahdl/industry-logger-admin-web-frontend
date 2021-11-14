import httpClient from '@/services/http-client'

const baseUrl = 'table-field'

export default class TableFieldService {
  static async findById(id) {
    const { data } = await httpClient.get([baseUrl, id].join('/'))
    return data
  }

  static async findByIdTable(idTable) {
    const { data } = await httpClient.get([baseUrl, 'table', idTable].join('/'))
    return data
  }

  static async create(tableField) {
    const { data } = await httpClient.post(baseUrl, tableField)
    return data
  }

  static async update(id, tableField) {
    const { data } = await httpClient.patch([baseUrl, id].join('/'), tableField)
    return data
  }

  static async delete(id) {
    const { data } = await httpClient.delete([baseUrl, id].join('/'))
    return data
  }
}