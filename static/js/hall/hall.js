/**
 * @fileOverview for hall.jsp
 * @Author       adoug
 * @DateTime     2016-11-24
 */

'use strict';

const infiniteScroll = require('vue-infinite-scroll').infiniteScroll;

const Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlSearchProject = '/fn/get/project';

const urlSearchHotProject = '/fn/get/hotProject';

const urlCollect = '/fn/project/collect';
const urlUnCollect = '/fn/project/uncollect'

//组件间通信，事件代理
let bus = new Vue();

//searchBar接收请求操作后通知projectBox
bus.$on('initProjectBox', function(keyWords) {
	projectBox.pageNum = 1;
	projectBox.keyWords = keyWords;

	projectBox.loadProject();
	projectBox.loadHotProject();
});

Vue.component('tic-project', {
	template: '#tic-project',

	props: ['projectInit', 'index', 'userId'],

	data: {
		project: function() {
			return this.projectInit;
		}
	},

	methods: {
		collect: function(params) {
			//假装收藏成功，这样给用户的反馈快一点，收藏失败再回滚
			this.$emit('collect', params.projectIndex);
			// this.project.isCollected = true;

			let url = `${urlCollect}?userid=${params.userId}&projectid=${this.project.proId}`;
			fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				}
			})
			.then(response => response.json())
			.then(function(data) {
				if (data.code === 'error') {
					this.$emit('uncollect', params.projectIndex);
					// this.project.isCollected = false;
					this.$emit('collectFail');
				}
			});
		},

		uncollect: function(params) {
			//假装收藏成功，这样给用户的反馈快一点，收藏失败再回滚
			this.$emit('uncollect', params.projectIndex);
			// this.project.isCollected = false;

			let url = `${urlUnCollect}?userid=${params.userId}&projectid=${this.project.proId}`;
			fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				}
			})
			.then(response => response.json())
			.then(function(data) {
				if (data.code === 'error') {
					this.$emit('collect', params.projectIndex);
					// this.project.isCollected = false;
					this.$emit('collectFail');
				}
			});
		}
	}
});

let projectBox = new Vue({
	el: '#appBody',
	data: {
		projects: [],
		hotProjects: [],

		busy: false,
		noMore: false,
		isLoading: false,
		checkImmediately: false,

		collectIsFail: false,

		pageNum: 1,
		pageSize: 8,
		hotSize: 2,

		keyWords: ''
	},

	methods: {
		loadProject: loadProject,
		loadHotProject: loadHotProject,

		collect: function(index) {
			this.projects[index].isCollected = true;
		},

		collectHot: function(index) {
			this.hotProjects[index].isCollected = true;
		},

		uncollect: function(index) {
			this.projects[index].isCollected = false;
		},

		uncollectHot: function(index) {
			this.hotProjects[index].isCollected = false;
		},

		closeDialog: function() {
			this.collectIsFail = false;
		},

		openDialog: function() {
			this.collectIsFail = true;
		}
	},

	directives: {infiniteScroll}
});

let searchBar = new Vue({
	el: '#searchBar',
	data: {
		keyWords: '',

		isFocusing: false
	},

	beforeMount: function() {
		this.search();
	},

	methods: {
		showInput: function() {
			this.isFocusing = true;

			this.$nextTick(function() {
				this.$el.querySelector('#searchInput').focus();
			});
		},

		inputBlur: function() {
			if (!this.keyWords.length) {
				this.isFocusing = false;
			}
		},

		clearInput: function() {
			this.keyWords = '';
		},

		cancelSearch: function() {
			this.keyWords = '';
			this.isFocusing = false;
		},

		search: function() {
			//通知projectBox
			bus.$emit('initProjectBox', this.keyWords);
		}
	}
});

/**
 * [loadProject description]
 * @fileOverview 加载普通project列表
 * @param        {[int]}   pageNum [页码]
 */
function loadProject(pageNum) {
	if (this.noMore) {
		return;
	}

	pageNum = pageNum || this.pageNum

	let url = `${urlSearchProject}?pageNum=${pageNum}&size=${this.pageSize}&keyWords=${this.keyWords}`;

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
		self.projects = self.projects.concat(data.projects);

		if (data.hasMore === false) {
			self.noMore = true;
		}

		self.pageNum++;
		self.busy = false;
	});
}

/**
 * [loadHotProject description]
 * @fileOverview 加载Hot-project列表
 */
function loadHotProject() {
	let url = `${urlSearchHotProject}?hotSize=${this.hotSize}&keyWords=${this.keyWords}`;

	self = this;

	fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json'
		}
	})
	.then(response => response.json())
	.then(function(data) {
		self.hotProjects.splice(0, 2);
		self.hotProjects = self.hotProjects.concat(data.projects);
	});
}