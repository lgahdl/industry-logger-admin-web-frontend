import httpClient from '@/services/http-client/telos.http-client'

export default class UploadFileService {
  static async uploadFile(file) {
    const splittedFilename = file.name.split('.')
    const filename = [splittedFilename[0], String(Math.random() * (100)).replaceAll('.', ''), `.${splittedFilename[splittedFilename.length - 1]}`].join('')
    const signedUrl = await UploadFileService.getSignedUrl(filename)
    await this.uploadFileToStorage(signedUrl, file)
    return filename
  }

  static async getSignedUrl(filename) {
    const { data } = await httpClient.get(`upload-url/${filename}`)
    return data
  }

  static uploadFileToStorage(signedUrl, file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', signedUrl, true)
      xhr.onload = () => resolve()
      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          console.log((e.loaded / e.total) * 100)
        }
      }
      xhr.onerror = err => reject(err)

      xhr.send(file)
    })
  }
}
