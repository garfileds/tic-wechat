'use strict';

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlValidUserName = `${urlPrefix}/fn/valid/username`;

let formRegister;
formRegister = new Vue({
    el: '#formRegister',
    data: {
        username: '',
        password: '',
        passConfirm: '',

        validRule: {
            'username': [{
                pattern: 'required',
                errorMsg: '用户名不可为空'
            }, {
                pattern: /^[\d\w_]{2,20}$/,
                errorMsg: '用户名需要2—20个字符，只能包含英文、数字和下划线'
            }, {
                pattern: nameIsUsed,
                errorMsg: '换个名字呗，有人取过了',
                isAsyn: true
            }],
            'password': [{
                pattern: 'required',
                errorMsg: '密码不能为空'
            }, {
                pattern: /^[\d\w_]{6,30}$/,
                errorMsg: '密码需要6—30个字符，只能包含英文、数字和下划线'
            }],
            'passConfirm': [{
                pattern: passIsSame,
                errorMsg: '两次密码输入不一致'
            }]
        }
    },
    computed: {
        errorMsg: function () {
            let errorMsg = '';
            let result;

            // 这个bug啊，Object.entries导致this.validRule变化时不能响应
            // for (let filedRule of Object.entries(this.validRule))
            for (let filedName in this.validRule) {
                if (this.validRule.hasOwnProperty(filedName)) {
                    result = this.validRule[filedName].every(function (rule) {
                        if (rule.invalid) {
                            errorMsg = rule.errorMsg;
                            return false;
                        }

                        return true;
                    });
                }

                if (!result) break;
            }

            return errorMsg;
        },

        usernameError: function () {
            return this.validRule.username.every(function (rule) {
                return rule.invalid;
            });
        },

        passError: function () {
            return this.validRule.password.concat(this.validRule.passConfirm).every(function (rule) {
                return rule.invalid;
            });
        },

        hasError: function () {
            let result = true;
            for (let filedName in this.validRule) {
                if (this.validRule.hasOwnProperty(filedName)) {
                    result = result && this.validRule[filedName].every(function (rule) {
                        return !rule.invalid;
                    });
                }
            }
            return !result;
        }
    },

    created: function () {
        //init validRule
        let self = this;
        for (let filedName in this.validRule) {
            if (this.validRule.hasOwnProperty(filedName)) {
                this.validRule[filedName].forEach((rule, index) => {
                   self.$set(rule, 'filed', filedName);
                   self.$set(rule, 'index', index);
                   self.$set(rule, 'invalid', false);
                });
            }
        }
    },

    methods: {
        validUsername: function () {
            let promiseValid = new Promise(this._validFiledGen('username'));
            promiseValid.catch(error => {
                console.log(error.message);
            });
        },

        validPass: function () {
            let promiseValid = new Promise(this._validFiledGen('password'));
            promiseValid.catch(error => {
                console.log(error.message);
            });
        },

        validPassConfirm: function () {
            let promiseValid = new Promise(this._validFiledGen('passConfirm'));
            promiseValid.catch(error => {
                console.log(error.message);
            });
        },

        /**
         * syn valid this.validRule
         */
        validForm: function () {
            let fileds = [];
            for (let filed in this.validRule) {
                if (this.validRule.hasOwnProperty(filed)) {
                    fileds.push(filed);
                }
            }

            let sequence = Promise.resolve();
            fileds.forEach(function (filed) {
                sequence = sequence.then(() => {
                    return new Promise(formRegister._validFiledGen(filed));
                }).then(result => {
                    if (result.code === 'invalid') {
                        throw new Error('Big Error');
                    }
                });
            });

            sequence.then(() => {
                formRegister.$el.submit();
            }).catch(error => {
                console.log('form invalid');
            });
        },

        /**
         * 生成用于field验证的Promise的构造函数，其中filed字段可以自行指定
         * @param filed [String] 表单字段：username, password...
         * @returns {Function}
         */
        _validFiledGen: function (filed) {
            return function (resolve, reject) {
                let filedPromiseResolve = resolve;

                let filedRule = formRegister.validRule[filed];

                let sequence = Promise.resolve();

                // execute rule-valid asyn
                filedRule.forEach(function (rule) {
                    sequence = sequence.then(() => {
                        return [rule].map(rule2Promise)[0];
                    }).then(result => {
                        let filed = result.rule.filed;
                        let index = result.rule.index;
                        if (result.code === 'invalid') {
                            formRegister.validRule[filed][index].invalid = true;
                            throw new Error('Big Error');
                        } else if (result.code === 'valid') {
                            formRegister.validRule[filed][index].invalid = false;
                            resolve();
                        }
                    });
                });

                sequence.catch(error => {
                    return {code: 'invalid'};
                })
                .then(result => {
                    if (result.code !== 'invalid') {
                        filedPromiseResolve({code: 'invalid'});
                    } else {
                        filedPromiseResolve({code: 'valid'});
                    }
                });
            };
        },

        _validPattern: function (rule) {
            if (rule.pattern === 'required') {
                return this[rule.filed].length > 0;
            } else if (rule.pattern instanceof RegExp) {
                return this[rule.filed].search(rule.pattern) > -1;
            } else if (rule.pattern instanceof Function) {
                return rule.pattern.call(this);
            }
        },

        _rule2Promise: rule2Promise
    }
});

/**
 * 将rule.pattern转换为Promise
 * 该函数作为Array.prototype.map的参数
 * Unfortunately，若rule.pattern是异步的，需要在rule里标记（即属性isAsyn为true）
 * @param rule
 * @returns {Promise}
 */
function rule2Promise (rule) {
    if (rule.pattern instanceof Function && rule.isAsyn) {
        return new Promise(asynPromiseRuleConstructorGen(rule));
    } else {
        return new Promise((function (resolve) {
            if (!this._validPattern(rule)) {
                resolve({code: 'invalid', rule})
            } else {
                resolve({code: 'valid', rule});
            }
        }).bind(formRegister));
    }
}

/**
 * 将rule.pattern转换为Promise的constructor, 其中rule可指定
 * @param rule
 * @returns {Function}
 */
function asynPromiseRuleConstructorGen(rule) {
    return function (resolve, reject) {
        rule.pattern.call(formRegister, resolve, reject, rule);
    };
}

function nameIsUsed(resolve, reject, rule) {
    let self = this;
    fetch(urlValidUserName, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: self.username
        })
    })
    .then(response => response.json())
    .then(function(data) {
        if (data.code === 'ok') {
            self.validRule[rule.filed][rule.index].invalid = false;
            resolve();
        } else {
            self.validRule[rule.filed][rule.index].invalid = true;
            throw new Error('Big Error');
        }
    });
}

function passIsSame() {
    return this.password === this.passConfirm;
}