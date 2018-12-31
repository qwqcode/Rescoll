/* el */

const InputValidators = {
  // 匹配Email地址
  isEmail: function (str) {
    if (str === null || str === '') return false
    var result = str.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
    return !!result
  },
  // 匹配qq
  isQq: function (str) {
    if (str === null || str === '') return false
    var result = str.match(/^[1-9]\d{4,12}$/)
    return !!result
  },
  // 匹配 english
  isEnglish: function (str) {
    if (str === null || str === '') return false
    var result = str.match(/^[A-Za-z]+$/)
    return !!result
  },
  // 匹配integer
  isInteger: function (str) {
    if (str === null || str === '') return false
    var result = str.match(/^[-\\+]?\d+$/)
    return !!result
  },
  // 匹配double或float
  isDouble: function (str) {
    if (str === null || str === '') return false
    var result = str.match(/^[-\\+]?\d+(\.\d+)?$/)
    return !!result
  },
  // 匹配URL
  isUrl: function (str) {
    if (str === null || str === '') return false
    var result = str.match(/^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\\/=\\?%\-&_~`@[\]\\’:+!]*([^<>\\"])*$/)
    return !!result
  }
}

export default InputValidators
