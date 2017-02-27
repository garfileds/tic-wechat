/**
 * @fileOverview for /project/check.jsp
 * @Author       adoug
 * @DateTime     2017-2-23
 */

'use strict';

const infiniteScroll = require('vue-infinite-scroll').infiniteScroll;

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlOperateProject = `${urlPrefix}/fn/admin/project/operate`;

let appBox = new Vue({
	el: '#app',
	data: {
		sidePush: false,

		placeholder: '随心所搜...',
		keyWords: '',

		project: projectInfo,

		isChecked: false
	},

	methods: {
		push: function() {
            this.sidePush = !this.sidePush;
        },

        accept: function() {
        	let self = this;

        	requestProcessProject(self, 'accept');
        },

        reject: function() {
        	let self = this;

        	requestProcessProject(self, 'reject');
        },

        search: function() {
        }
	}
});


/**
 * @fileOverview 将审核操作发送给后台
 * @param        {[vue-组件]}   vProject  [project组件]
 * @param        {[String]}   operation [审核操作：pass/reject]
 * @param        {[Int]}   proIndex  [vProject父组件中的索引]
 */
function requestProcessProject(vProject, operation) {
	fetch(urlOperateProject, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			"operation": operation,
			"proId": vProject.project.proId
		})
	})
	.then(response => response.json())
	.then(function(data) {
		if (data.code === 'ok') {
			vProject.isChecked = true;
			vProject.$nextTick(function() {
				setTimeout(function() {
					window.location.href = `${urlPrefix}/admin/project/check`;
				}, 1000);
			});
		} else {
			alert('网络错误，请稍后重试。');
		}
	})
	.catch(function(error) {
		alert('网络错误，请稍后重试。');
	});
}