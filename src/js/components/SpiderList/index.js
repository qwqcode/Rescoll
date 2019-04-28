/**
 * 任务选择列表
 */
import Form from './Form.js'
import InputValidators from '../../utils/InputValidators'

// 操作列表
const SpiderList = {}
SpiderList.Business = {
  _NamespaceLabel: '电商'
}
SpiderList.Business.CollItemDescImg = {
  label: '商品详情页图片解析',
  genForm () {
    let pageUrlEl = Form.textInput('PageUrl', '详情页链接', '', InputValidators.isUrl)
    pageUrlEl.on('input propertychange', () => {
      let urlVal = $.trim(pageUrlEl.val())
      let urlMap = {
        'Tmall': ['https://detail.tmall.com'],
        'Taobao': ['https://item.taobao.com'],
        'Alibaba': ['https://detail.1688.com'],
        'Suning': ['https://product.suning.com'],
        'Gome': ['https://item.gome.com.cn']
      }
      for (let key in urlMap) {
        for (let i in urlMap[key]) {
          if (urlVal.indexOf(urlMap[key][i]) === 0) {
            PageTypeEl.val(key)
          }
        }
      }
    })
    let PageTypeEl = Form.selectInput('PageType', '链接类型', {
      'Tmall': '天猫',
      'Taobao': '淘宝',
      'Alibaba': '阿里巴巴',
      'Suning': '苏宁易购',
      'Gome': '国美在线'
    })
    Form.selectInput('ImgType', '图片类型', {
      'Thumb': '主图',
      'Category': '分类图',
      'Desc': '详情图'
    })
    Form.selectInput('CollType', '采集模式', {
      'collImgSrcUrl': '显示图片链接',
      'collDownloadImgSrc': '显示图片链接 并 下载打包保存'
    })
  }
}
SpiderList.Business.TaobaoSellerColl = {
  label: '淘宝店铺搜索卖家ID名采集',
  genForm () {
    Form.textInput('PageUrl', '店铺搜索页链接', '', InputValidators.isUrl)
    Form.numberInput('CollBeginPage', '采集开始页码', 1, 1)
    Form.numberInput('CollEndPage', '采集结束页码', undefined, 1)
    Form.selectInput('IgnoreTmall', '忽略天猫卖家', {
      'on': '开启',
      'off': '关闭'
    })
  }
}
SpiderList.Business.TmallGxptInvite = {
  label: '天猫供销平台分销商一键邀请',
  genForm () {
    Form.textareaInput('SellerId', '分销商ID名（一行一个）', undefined, 250)
  }
}
SpiderList.Business.TmallGxptInviteDelete = {
  label: '天猫供销平台分销商一键撤回',
  genForm () {
    Form.numberInput('DeleteBeginPage', '撤回开始页码', 1, 1)
    Form.numberInput('DeleteEndPage', '撤回结束页码', undefined, 1)
  }
}
SpiderList.Picture = {
  _NamespaceLabel: '图片'
}
SpiderList.Picture.Test = {
  label: '开发测试 DEBUG...',
  genForm () {}
}
SpiderList.Debug = {
  _NamespaceLabel: '调试'
}
SpiderList.Debug.Default = {
  label: 'Default',
  genForm () {}
}

export default SpiderList
