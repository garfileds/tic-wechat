/**
 * @fileOverview tools
 * @Author       adoug
 * @DateTime     2016-11-24
 */

function serialize(form) {
    if (typeof form === 'string') {
        form = document.querySelector(form);
    }

    var len = form.elements.length; //表单字段长度;表单字段包括<input><select><button>等
    var field = null; //用来存储每一条表单字段
    var parts = []; //保存字符串将要创建的各个部分
    var opLen, //select中option的个数
        opValue; //select中option的值
    //遍历每一个表单字段
    var i, j;
    for (i = 0; i < len; i++) {
        field = form.elements[i];
        switch (field.type) {
            case "select-one":
            case "select-multiple":
                if (field.name.length) {
                    for (j = 0, opLen = filed.options.length; j < opLen; j++) {
                        option = field.options[j];
                        if (option.selected) {
                            opValue = '';
                            if (option.hasAttribute) {
                                opValue = (option.hasAttribute('value') ? option.value : option.text);
                            } else {
                                opValue = (option.hasAttribute['value'].specified ? option.value : option.text); //IE下
                            }
                            parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(opValue));
                        }

                    }
                }
                break;
            case undefined:
            case "file":
            case "submit":
            case "reset":
            case "button":
                break;
            case "radio":
            case "checkbox":
                if (!field.checked) {
                    break;
                }
            default:
                if (field.name.length) {
                    opValue = field.value;
                    parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(opValue.trim()));
                }
                break;
        }
    }
    return parts.join("&");
}

function SaferHTML(templateData) {
  var s = templateData[0];
  for (var i = 1; i < arguments.length; i++) {
    var arg = String(arguments[i]);

    // 转义占位符中的特殊字符。
    s += arg.replace(/&/g, "&")
            .replace(/</g, "<")
            .replace(/</g, ">");

    // 不转义模板中的特殊字符。
    s += templateData[i];
  }
  return s;
}

/**
 * @fileOverview 获取url中GET类型的参数
 * @param        {[String]}   url 
 * @return       {[Object]}   params
 */
function getParams(url) {
    let urlQuery = url.split('?')[1];
    let params = {};

    let parts = urlQuery.split('&');
    for(let i = 0, len = parts.length; i < len; i++) {
        let part = parts[i].split('=');

        params[part[0]] = part[1];
    }

    return params;
}

/**
 * @fileOverview 页面跳转后用户点击后退按钮时留在本页（注册后跳到登录，这时候点击后退）
 * @param        {[RegExp]}   pattern
 */
function avoidBack(pattern) {
    if (document.referrer.search(pattern) > -1) {
        for (var i = 0; i < 5; i++) {
            window.history.pushState(null, document.title);
        }
    }
}

module.exports = {
    formSerialize: serialize,
    SaferHTML: SaferHTML,
    getParams: getParams,
    avoidBack: avoidBack
};
