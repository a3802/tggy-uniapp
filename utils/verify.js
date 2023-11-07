/**
 * 用户输入内容验证类
 */

// 是否为空
export const isEmpty = (str) => {
  return str.trim() == ''
}

/**
 * 匹配phone
 */
export const isPhone = (str) => {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
  return reg.test(str)
}

/**
 * 匹配phone
 */
export const isMobile = (str) => {
  const reg = /^(1[3456789]\d{9})$/
  return reg.test(str)
}

export const isOperator = (str,productId) => {
	
	var CMCC = /(^((13[4-9]{1})|(147)|(15[0-2]{1})|(15[7-9]{1})|(178)|(18[2-4]{1})|(18[7-8]{1}))\d{8}$)/;//中国移动
	var CUCC = /(^((13[0-2]{1})|(145)|(155)|(156)|(171)|(175)|(176)|(185)|(186))\d{8}$)/;//中国联通
	var CTCC = /(^((133)|(149)|(153)|(173)|(177)|(180)|(181)|(189)|(199))\d{8}$)/;//中国电信
	var VTCC = /(^((1703)|(1705)|(1706))\d{7}$)|(^(170[0-2]{1})\d{7}&)|(^(170[7-9]{1})\d{7}$)|(162)|(165)|(167)/; //虚拟号段
	var CMCC_ID = [210069,110069]; //中国移动充值项
	var CUCC_ID = [210070,110070]; //中国联通充值项
	var CTCC_ID = [210071,110071]; //中国电信充值项
	
	if (CMCC.test(str) && CMCC_ID.includes(productId)){
		return true;
	}else if (CUCC.test(str) && CUCC_ID.includes(productId)){
		return true;
	}else if (CTCC.test(str) && CTCC_ID.includes(productId)){
		return true;
	}else{
		return false;
	}	
} 

/**
 * 匹配Email地址
 */
export const isEmail = (str) => {
  if (str == null || str == "") return false
  var result = str.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
  if (result == null) return false
  return true
}

/**
 * 判断数值类型，包括整数和浮点数
 */
export const isNumber = (str) => {
  if (isDouble(str) || isInteger(str)) return true
  return false
}

/**
 * 判断是否为正整数(只能输入数字[0-9])
 */
export const isPositiveInteger = (str) => {
  return /(^[0-9]\d*$)/.test(str)
}

/**
 * 匹配integer
 */
export const isInteger = (str) => {
  if (str == null || str == "") return false
  var result = str.match(/^[-\+]?\d+$/)
  if (result == null) return false
  return true
}

/**
 * 匹配double或float
 */
export const isDouble = (str) => {
  if (str == null || str == "") return false
  var result = str.match(/^[-\+]?\d+(\.\d+)?$/)
  if (result == null) return false
  return true
}
