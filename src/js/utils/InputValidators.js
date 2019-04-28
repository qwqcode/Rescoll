const InputValidators = {
  // 匹配Email地址
  isEmail (str) {
    if (str === null || str === '') return false
    let result = str.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
    return !!result
  },
  // 匹配qq
  isQq (str) {
    if (str === null || str === '') return false
    let result = str.match(/^[1-9]\d{4,12}$/)
    return !!result
  },
  // 匹配 english
  isEnglish (str) {
    if (str === null || str === '') return false
    let result = str.match(/^[A-Za-z]+$/)
    return !!result
  },
  // 匹配integer
  isInteger (str) {
    if (str === null || str === '') return false
    let result = str.match(/^[-\\+]?\d+$/)
    return !!result
  },
  // 匹配double或float
  isDouble (str) {
    if (str === null || str === '') return false
    let result = str.match(/^[-\\+]?\d+(\.\d+)?$/)
    return !!result
  },
  // 匹配URL
  isUrl (str) {
    if (str === null || str === '') return false
    let result = str.match(/^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\\/=\\?%\-&_~`@[\]\\’:+!]*([^<>\\"])*$/)
    return !!result
  }
}

export default InputValidators
