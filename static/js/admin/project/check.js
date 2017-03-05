/**
 * @fileOverview for /project/check.jsp
 * @Author       adoug
 * @DateTime     2017-2-23
 */

'use strict';

const infiniteScroll = require('vue-infinite-scroll').infiniteScroll;

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlGetProjectUncheck = `${urlPrefix}/fn/admin/get/project/uncheck`;
const urlOperateProject = `${urlPrefix}/fn/admin/project/operate`;

let pageNum = 0;
const pageSize = 8;

Vue.component('tic-project-check', {
	template: '#tic-project-check',
	props: ['project', 'index', 'ensurereject'],

	watch: {
		ensurereject: function(newValue) {
			var self = this;

			newValue && requestProcessProject(self, 'reject', this.project.proIndex);
		}
	},

	methods: {
		reject: function(params) {
			let self = this;

			this.$emit('toreject', params.proIndex);
		},

		accept: function(params) {
			let self = this;

			requestProcessProject(self, 'accept', params.proIndex);
		},
	}
});

Vue.component('tic-tag', {
	template: '#tic-tag',

	props: ['projectindex', 'toshow'],

	data: function() {
		return {
			rejectReason: ''
		};
	},

	methods: {
		hideRejectDialog: function() {
        	this.$emit('hide-reject-dialog');
        },

        ensureReject: function() {
        	this.$emit('ensure-reject', this['projectindex'], this.rejectReason);
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
		keyWords: '',

		rejectProjectIndex: '',
		isShowReject: false
	},

	beforeMount: function() {
		loadMore.call(this);
	},

	methods: {
		loadMore: loadMore,

		push: function() {
            this.sidePush = !this.sidePush;
        },

        processProject: function(proIndex) {
        	let self = this;

        	this.isShowReject = false;

        	this.projects[proIndex].isProcessed = true;
        	this.$nextTick(function() {
				setTimeout(function() {
	            	self.projects[proIndex].animationEnd = true;
	            }, 500);
			});
        },

        search: function() {
        	pageNum = 0;

        	this.busy = false;
        	this.noMore = false;
        	this.isLoading = false;
        	this.checkImmediately = false;

        	this.projects.splice(0, this.projects.length);

        	loadMore.call(this);
        },

        toReject: function(proIndex) {
        	this.isShowReject = true;
        	this.rejectProjectIndex = proIndex;
        },

        hideRejectDialog: function() {
        	this.isShowReject = false;
        },

        ensureReject: function(proIndex, rejectReason) {
        	this.projects[proIndex].rejectReason = rejectReason;
        	this.projects[proIndex].ensureReject = true;
        	this.projects[proIndex].proIndex = proIndex;
        }
	},

	directives: {infiniteScroll}
});

function loadMore() {
	if (this.noMore) {
		return;
	}

	let url = `${urlGetProjectUncheck}?pageNum=${pageNum}&size=${pageSize}&keyWords=${this.keyWords}`;

	this.busy = true;
	this.isLoading = true;
	let self = this;

	fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json'
		},
		credentials: 'same-origin'
	})
	.then(response => response.json())
	.then(function(data) {
		self.isLoading = false;

		data.projects.map(function(el) {
			el.isProcessed = false;
			el.animationEnd = false;
			el.ensureReject = false;
			el.rejectReason = '';
			el.proIndex = '';
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
 * @fileOverview 将审核操作发送给后台
 * @param        {[vue-组件]}   vProject  [project组件]
 * @param        {[String]}   operation [审核操作：pass/reject]
 * @param        {[Int]}   proIndex  [vProject父组件中的索引]
 */
function requestProcessProject(vProject, operation, proIndex, rejectReason) {
	fetch(urlOperateProject, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify({
			"operation": operation,
			"proId": vProject.project.proId,
			"rejectReason": vProject.project.rejectReason
		})
	})
	.then(response => response.json())
	.then(function(data) {
		if (data.code === 'ok') {
			vProject.$emit('process', proIndex);
		} else {
			alert('网络错误，请稍后重试。');
		}
	})
	.catch(function(error) {
		alert('网络错误，请稍后重试。');
	});
}