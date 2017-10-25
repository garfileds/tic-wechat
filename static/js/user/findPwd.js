/**
 * Created by adoug on 2017/10/24.
 */

'use strict'

require('whatwg-fetch')

const apiFindPwd = `${urlPrefix}/api/user/findPwd`

const urlLogin = `${urlPrefix}/user/login`

let formFindPwd = new Vue({
  el: '#formFindPwd',
  data: {
    email: '',
    user: userInfo,

    findPwdIsOk: false,

    validRule: {
      'email': [{
        pattern: 'required',
        errorMsg: '邮箱不可为空'
      }, {
        pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
        errorMsg: '请输入正确格式的邮箱'
      }]
    }
  },
  computed: {
    errorMsg: function () {
      let errorMsg = ''
      let result

      for (let filedName in this.validRule) {
        if (this.validRule.hasOwnProperty(filedName)) {
          result = this.validRule[filedName].every(function (rule) {
            if (rule.invalid) {
              errorMsg = rule.errorMsg
              return false
            }

            return true
          })
        }

        if (!result) break
      }

      return errorMsg
    },

    emailError: function () {
      return this.validRule.email.every(function (rule) {
        return rule.invalid
      })
    },

    hasError: function () {
      let result = true
      for (let filedName in this.validRule) {
        if (this.validRule.hasOwnProperty(filedName)) {
          result = result && this.validRule[filedName].every(function (rule) {
            return !rule.invalid
          })
        }
      }
      return !result
    }
  },

  created: function () {
    //init validRule
    let self = this
    for (let filedName in this.validRule) {
      if (this.validRule.hasOwnProperty(filedName)) {
        this.validRule[filedName].forEach((rule, index) => {
          self.$set(rule, 'filed', filedName)
          self.$set(rule, 'index', index)
          self.$set(rule, 'invalid', false)
        })
      }
    }
  },

  methods: {
    validEmail: function () {
      let promiseValid = new Promise(this._validFiledGen('email'))
      promiseValid.catch(error => {
        console.log(error.message)
      })
    },

    /**
     * syn valid this.validRule
     */
    validForm: function () {
      const self = this

      let fileds = []
      for (let filed in this.validRule) {
        if (this.validRule.hasOwnProperty(filed)) {
          fileds.push(filed)
        }
      }

      let sequence = Promise.resolve()

      for (let i = 0, len = fileds.length; i <= len; i++) {
        (function (index) {
          if (index === len) {
            sequence.then(() => {
              fetch(apiFindPwd, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                  userId: self.user.id,
                  email: self.email
                })
              })
              .then(response => response.json())
              .then(result => {
                if (result.code === 'ok') {
                  self.findPwdIsOk = true
                  self.$nextTick(() => {
                    setTimeout(() => {
                      window.location.href = urlLogin
                    }, 1500)
                  })
                }
              })
            }).catch(() => {
              console.log('form invalid')
            })
          } else {
            sequence = sequence.then(() => {
              return new Promise(formFindPwd._validFiledGen(fileds[index]))
            }).then(result => {
              if (result.code === 'invalid') {
                throw new Error('Big Error')
              }
            })
          }
        })(i)
      }
    },

    /**
     * 生成用于field验证的Promise的构造函数，其中filed字段可以自行指定
     * @param filed [String] 表单字段：username, password...
     * @returns {Function}
     */
    _validFiledGen: function (filed) {
      return function (resolve) {
        let filedPromiseResolve = resolve

        let filedRule = formFindPwd.validRule[filed]

        let sequence = Promise.resolve()

        for (let i = 0, len = filedRule.length; i <= len; i++) {
          (function (index) {
            if (index === len) {
              sequence.catch(() => {
                return {code: 'invalid'}
              }).then(result => {
                if (result.code === 'invalid') {
                  filedPromiseResolve({code: 'invalid'})
                } else {
                  filedPromiseResolve({code: 'valid'})
                }
              })
            } else {
              sequence = sequence.then(() => {
                return [filedRule[index]].map(rule2Promise)[0]
              }).then(result => {
                let filed = result.rule.filed
                let index = result.rule.index
                if (result.code === 'invalid') {
                  formFindPwd.validRule[filed][index].invalid = true
                  throw new Error('Big Error')
                } else if (result.code === 'valid') {
                  formFindPwd.validRule[filed][index].invalid = false
                  return {code: 'valid'}
                }
              })
            }
          })(i)
        }
      }
    },

    _validPattern: function (rule) {
      if (rule.pattern === 'required') {
        return this[rule.filed].length > 0
      } else if (rule.pattern instanceof RegExp) {
        return this[rule.filed].search(rule.pattern) > -1
      } else if (rule.pattern instanceof Function) {
        return rule.pattern.call(this)
      }
    },

    _rule2Promise: rule2Promise
  }
})

/**
 * 将rule.pattern转换为Promise
 * 该函数作为Array.prototype.map的参数
 * Unfortunately，若rule.pattern是异步的，需要在rule里标记（即属性isAsyn为true）
 * @param rule
 * @returns {Promise}
 */
function rule2Promise (rule) {
  if (rule.pattern instanceof Function && rule.isAsyn) {
    return new Promise(asynPromiseRuleConstructorGen(rule))
  } else {
    return new Promise((function (resolve) {
      if (!this._validPattern(rule)) {
        resolve({code: 'invalid', rule})
      } else {
        resolve({code: 'valid', rule})
      }
    }).bind(formFindPwd))
  }
}

/**
 * 将rule.pattern转换为Promise的constructor, 其中rule可指定
 * @param rule
 * @returns {Function}
 */
function asynPromiseRuleConstructorGen(rule) {
  return function (resolve, reject) {
    rule.pattern.call(formFindPwd, resolve, reject, rule)
  }
}
