var kfSHA1 = require("kfSHA1.js");

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function tsFormatTime(timestamp, format) {

  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  let returnArr = [];

  let date = new Date(timestamp);
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  returnArr.push(year, month, day, hour, minute, second);

  returnArr = returnArr.map(formatNumber);

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

// 获取客服帮助url
function getCustomUrl(helpTitle) {
  var timestamp = new Date().getTime();
  var webToken = wx.getStorageSync("securityMobile");
  var title = helpTitle;
  var c_name = wx.getStorageSync("hideName");
  var imUserKey = "aad48d544fea0b99e301d2fda3eb021c";

  var sign_str = "nonce=" + timestamp + "&timestamp=" + timestamp + "&web_token=" + webToken + "&" + imUserKey;
  sign_str = kfSHA1.hex_sha1(sign_str);
  sign_str = sign_str.toUpperCase();
  var url = 'http://jsz.udesk.cn/im_client/?web_plugin_id=42732&c_phone=' + webToken +
    '&nonce=' + timestamp + '&signature=' + sign_str + '&timestamp=' + timestamp + '&web_token=' + webToken +
    '&c_cn_title=' + title + '&c_name=' + c_name;

    return url;
}

module.exports = {
  formatTime: formatTime,
  tsFormatTime: tsFormatTime,
  getCustomUrl: getCustomUrl
}