import httpClient from '@/services/http-client'

const baseUrl = 'log'

export default class LogService {
  static async findAll(macAddress, initialDate, finalDate) {
    const { data } = await httpClient.get([baseUrl, macAddress].join('/'), { params: { initialDate, finalDate } })
    return data
  }

  static async findLast(macAddress) {
    const { data } = await httpClient.get([baseUrl, macAddress, 'last'].join('/'))
    return data
  }

  static async delete(finalDate) {
    const { data } = await httpClient.delete(baseUrl, { params: { finalDate } })
    return data
  }
}