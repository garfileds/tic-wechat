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

			editIsFail: false,
			editIsSucc: false
		},

		methods: {
			editDetail: function() {
				self = this;

				fetch(urlUpdateProject, {
					method: 'POST',
					headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	                },
	                credentials: 'same-origin',
	                body: tools.formSerialize('#formEditDetail')
				})
				.then(response => response.json())
				.then(function(data) {
					if (data.code === 'ok') {
						self.postIsSucc = true;
						setTimeout(() => {
							window.location.href = `${urlPrefix}/myProject/myPost/detail?proId=${self.project.proId}&uid=${self.user.id}`;
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
			}
		}
	});
});
