/**
 * @fileOverview for toJoin.jsp
 * @Author       adoug
 * @DateTime     2016-12-05
 */

window.addEventListener('load', function() {
	'use strict';

	let Promise = require('es6-promise').Promise;
	require('whatwg-fetch');

	let tool = require('../../module/tools');

	const urlToJoin = `${urlPrefix}/fn/project/toJoin`;

	let inputError = {
		'name': false,
		'apply': false,
		'profe': false,
		'phone': false,
		'stunum': false
	};

	let appToJoin = new Vue({
		el: '#appToJoin',
		data: {
			user: userInfo,
			userApply: '',

			project: projectInfo,

			inputError: inputError,

			editFail: false,
			editIsSucc: false
		},
		computed: {
			userSex: function() {
				return this.user.sex === 'boy' ? '男' : '女';
			},

			hasError: function() {
				let result = false;

				for (var item in this.inputError) {
					result = result || this.inputError[item];
				}

				return result;
			}
		},
		methods: {
			joinProject: function(params) {
				let self = this;

				if (this.hasError) {
					return;
				}

				fetch(urlToJoin, {
					method: 'POST',
					headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	                },
	                credentials: 'same-origin',
	                body: tool.formSerialize('#formToJoin')
				})
				.then(response => response.json())
				.then(function(data) {
					if (data.code === 'ok') {
						self.editIsSucc = true;
						setTimeout(() => {
							window.location.href = `${urlPrefix}/myProject/myCollect/detail?uid=${self.user.id}&proId=${self.project.proId}`;
						}, 500);
					} else {
						self.editFail = true;
					}
				})
				.catch(function(error) {
					self.editFail = true;
					console.log('request failed', error);
				});
			},

			closeDialog: function() {
				this.editFail = false;
			},

			validateToJoin: function(event) {
				let target = event.target,
					name = target.name,
					value = target.value;

				if (name === 'name' || name === 'apply' || name === 'profe' || name === 'phone' || name === 'stunum') {
					if (value === '') {
						this.inputError[name] = true;
					} else {
						this.inputError[name] = false;
					}
				}
			}
		}
	});
});