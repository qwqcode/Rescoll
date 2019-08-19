export default class Utils {
  static callBackendMethod (code: string): any {
    console.log(code)
  }

  /** bytes 格式化 */
  static formatBytes (bytes: number): string {
    if (bytes === 0) { return '0 B' }
    const k = 1000 // or 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / k ** i).toPrecision(3) + ' ' + sizes[i]
  }

  /** 路径中提取文件名 */
  public extractFilename (path: string) {
    const lastSlash = Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/'))
    return path.substring(lastSlash + 1)
  }
}
