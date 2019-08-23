export default {
  // 匹配Email地址
  isEmail (str: string) {
    if (str === null || str === '') { return false }
    const result = str.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
    return !!result
  },
  // 匹配qq
  isQq (str: string) {
    if (str === null || str === '') { return false }
    const result = str.match(/^[1-9]\d{4,12}$/)
    return !!result
  },
  // 匹配 english
  isEnglish (str: string) {
    if (str === null || str === '') { return false }
    const result = str.match(/^[A-Za-z]+$/)
    return !!result
  },
  // 匹配integer
  isInteger (str: string) {
    if (str === null || str === '') { return false }
    const result = str.match(/^[-\\+]?\d+$/)
    return !!result
  },
  // 匹配double或float
  isDouble (str: string) {
    if (str === null || str === '') { return false }
    const result = str.match(/^[-\\+]?\d+(\.\d+)?$/)
    return !!result
  },
  // 匹配URL
  isUrl (str: string) {
    if (str === null || str === '') { return false }
    const result = str.match(/^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\\/=\\?%\-&_~`@[\]\\’:+!]*([^<>\\"])*$/)
    return !!result
  }
}
