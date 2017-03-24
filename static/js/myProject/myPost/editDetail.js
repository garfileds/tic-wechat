/**
 * @fileOverview for editDetail.jsp
 * @Author       adoug
 * @DateTime     2016-12-03
 */

window.addEventListener('load', function() {
	'use strict';

	const Promise = require('es6-promise').Promise;
	require('whatwg-fetch');

	const tools = require('../../module/tools');

	const urlUpdateProject = `${urlPrefix}/fn/project/update`;

	let appEditDetail = new Vue({
		el: '#appEditDetail',

		data: {
			user: userInfo,
			project: projectInfo,

			content: projectInfo.content,
			recruit: projectInfo.recruit,
			contact: projectInfo.contact,
            validRule: {
                content:[{
                    pattern: /^(.|\n|\t){10,}$/m,
                    errorMsg: '项目详情至少10个字'
                }],
                recruit: [{
                    pattern: /^(.|\n|\t){6,}$/m,
                    errorMsg: '招聘详情至少6个字'
                }],
                contact: [{
                    pattern: 'required',
                    errorMsg: '联系方式没有填'
                }]
            },

			editIsFail: false,
			editIsSucc: false
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
			editDetail: function() {
				let self = this;

				fetch(urlUpdateProject, {
					method: 'POST',
					headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
	                    'Accept': 'application/json'
	                },
	                credentials: 'same-origin',
	                body: tools.formSerialize('#formEditDetail')
				})
				.then(response => response.json())
				.then(function(data) {
					if (data.code === 'ok') {
						self.editIsSucc = true;
						setTimeout(() => {
							window.location.href = `${urlPrefix}/myProject/myPost/detail?proId=${self.project.id}&uid=${self.user.id}`;
						}, 500);
					} else {
						self.editIsFail = true;
					}
				})
				.catch(function(error) {
					self.editIsFail = true;
					console.log('request failed', error);
				});
			},

			closeDialog: function() {
				this.editIsFail = false;
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

                for (let i = 0, len = fileds.length; i <= len; i++) {
                    (function (index) {
                        if (index === len) {
                            sequence.then(() => {
                                appEditDetail.editDetail();
                            }).catch(error => {
                                console.log('form invalid');
                            });
                        } else {
                            sequence = sequence.then(() => {
                                return new Promise(appEditDetail._validFiledGen(fileds[index]));
                            }).then(result => {
                                if (result.code === 'invalid') {
                                    throw new Error('Big Error');
                                }
                            });
                        }
                    })(i);
                }
            },

            /**
             * 生成用于field验证的Promise的构造函数，其中filed字段可以自行指定
             * @param filed [String] 表单字段：username, password...
             * @returns {Function}
             */
            _validFiledGen: function (filed) {
                return function (resolve, reject) {
                    let filedPromiseResolve = resolve;

                    let filedRule = appEditDetail.validRule[filed];

                    let sequence = Promise.resolve();

                    // execute rule-valid asyn
                    for (let i = 0, len = filedRule.length; i <= len; i++) {
                        (function (index) {
                            if (index == len) {
                                sequence.catch(error => {
                                    return {code: 'invalid'};
                                }).then(result => {
                                    if (result.code === 'invalid') {
                                        filedPromiseResolve({code: 'invalid'});
                                    } else {
                                        filedPromiseResolve({code: 'valid'});
                                    }
                                });
                            } else {
                                sequence = sequence.then(() => {
                                    return [filedRule[index]].map(rule2Promise)[0];
                                }).then(result => {
                                    let filed = result.rule.filed;
                                    let index = result.rule.index;
                                    if (result.code === 'invalid') {
                                        appEditDetail.validRule[filed][index].invalid = true;
                                        throw new Error('Big Error');
                                    } else if (result.code === 'valid') {
                                        appEditDetail.validRule[filed][index].invalid = false;
                                        return {code: 'valid'};
                                    }
                                });
                            }
                        })(i);
                    }
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
            return new Promise(function (resolve) {
                if (!appEditDetail._validPattern(rule)) {
                    resolve({code: 'invalid', rule})
                } else {
                    resolve({code: 'valid', rule});
                }
            });
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
});
