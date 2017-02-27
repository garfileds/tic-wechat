/**
 * @fileOverview for /project/check.jsp
 * @Author       adoug
 * @DateTime     2017-2-23
 */

'use strict';

const infiniteScroll = require('vue-infinite-scroll').infiniteScroll;

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlGetProjectAccept = `${urlPrefix}/fn/admin/get/project/accept`;
const urlOperateProject = `${urlPrefix}/fn/admin/project/operate`;

let pageNum = 0;
const pageSize = 8;

Vue.component('tic-project-look', {
	template: '#tic-project-look',
	props: ['project', 'index'],

	data: function() {
		return {
			isDeleted: false
		};
	},

	methods: {
		deleteProject: function(params) {
			let self = this;

			if (confirm('确定要删除该项目吗？')) {
				requestProcessProject(self, 'delete', params.proIndex);
			}
		}
	}
});

let projectBox = new Vue({
	el: '#app',
	data: {
		projects: [],
		busy: false,
		noMore: false,
		isLoading: false,
		checkImmediately: false,

		sidePush: false,

		placeholder: '你想要的项目...',
		keyWords: ''
	},

	beforeMount: function() {
		loadMore.call(this);
	},

	methods: {
		loadMore: loadMore,

		push: function() {
            this.sidePush = !this.sidePush;
        },

        deleteProject: function(proIndex) {
        	this.projects.splice(proIndex, 1);
        },

        search: function() {
        	pageNum = 0;

        	this.busy = false;
        	this.noMore = false;
        	this.isLoading = false;
        	this.checkImmediately = false;

        	this.projects.splice(0, this.projects.length);

        	loadMore.call(this);
        }
	},

	directives: {infiniteScroll}
});

function loadMore() {
	if (this.noMore) {
		return;
	}

	let url = `${urlGetProjectAccept}?pageNum=${pageNum}&size=${pageSize}&keyWords=${this.keyWords}`;

	this.busy = true;
	this.isLoading = true;
	self = this;

	fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json'
		}
	})
	.then(response => response.json())
	.then(function(data) {
		self.isLoading = false;

		data.projects.map(function(el) {
			el.isProcessed = false;
			el.animationEnd = false;
			return el;
		});
		self.projects = self.projects.concat(data.projects);

		if (data.hasMore === false) {
			self.noMore = true;
		}

		pageNum++;
		self.busy = false;
	});
}

/**
 * @fileOverview 将删除操作发送给后台
 * @param        {[vue-组件]}   vProject  [project组件]
 * @param        {[String]}   operation [审核操作：delete]
 * @param        {[Int]}   proIndex  [vProject父组件中的索引]
 */
function requestProcessProject(vProject, operation, proIndex) {
	fetch(urlOperateProject, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			operation: operation,
			proID: vProject.project.proId
		})
	})
	.then(response => response.json())
	.then(function(data) {
		if (data.code === 'ok') {
			vProject.isDeleted = true;
			vProject.$emit('delete', proIndex);
		} else {
			alert('网络错误，请稍后重试。');
		}
	})
	.catch(function(error) {
		alert('网络错误，请稍后重试。');
	});
}