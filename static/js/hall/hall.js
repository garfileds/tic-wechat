/**
 * @fileOverview for hall.jsp
 * @Author       adoug
 * @DateTime     2016-11-24
 */

'use strict';

const infiniteScroll = require('vue-infinite-scroll').infiniteScroll;

const Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlSearchProject = `${urlPrefix}/fn/get/project`;

const urlSearchHotProject = `${urlPrefix}/fn/get/hotProject`;

const urlCollect = `${urlPrefix}/fn/project/collect`;
const urlUnCollect = `${urlPrefix}/fn/project/uncollect`;

//组件间通信，事件代理
let bus = new Vue();

//searchBar接收请求操作后通知projectBox
bus.$on('loadProject', function(keyWords) {
	projectBox.pageNum = 0;
	projectBox.keyWords = keyWords;

	projectBox.projects.splice(0, projectBox.projects.length);
	projectBox.hotProjects.splice(0, projectBox.hotProjects.length);

	projectBox.noMore = false;
	projectBox.busy = false;
	projectBox.isLoading = false;
	projectBox.checkImmediately = false;

	projectBox.collectIsFail = false;

	projectBox.loadProject();
	projectBox.loadHotProject();
});

Vue.component('tic-project', {
	template: '#tic-project',

	props: ['project', 'index', 'userid'],

	computed: {
		projectDetailHref: function() {
			if (this.project.userId == this.userid) {
				return `${urlPrefix}/myProject/myPost/detail?proId=${this.project.id}`;
			} else {
				return `${urlPrefix}/project?proId=${this.project.id}&uid=${this.userid}`;
			}
		}
	},

	methods: {
		collect: function(params) {
			//假装收藏成功，这样给用户的反馈快一点，收藏失败再回滚
			this.$emit('collect', params.projectIndex);
			// this.project.isCollected = true;
			let self = this;

			let url = `${urlCollect}?userid=${params.userid}&proId=${this.project.id}`;
			fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				},
        credentials: 'same-origin'
			})
			.then(response => response.json())
			.then(function(data) {
				if (data.code === 'error') {
					self.$emit('uncollect', params.projectIndex);
					// this.project.isCollected = false;
					self.$emit('collectFail');
				}
			});
		},

		uncollect: function(params) {
			//假装收藏成功，这样给用户的反馈快一点，收藏失败再回滚
			this.$emit('uncollect', params.projectIndex);
			// this.project.isCollected = false;

			let self = this;

			let url = `${urlUnCollect}?userid=${params.userid}&proId=${this.project.id}`;
			fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				},
        credentials: 'same-origin'
			})
			.then(response => response.json())
			.then(function(data) {
				if (data.code === 'error') {
					self.$emit('collect', params.projectIndex);
					// this.project.isCollected = false;
					self.$emit('collectFail');
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

		pageNum: 0,
		pageSize: 5,
		hotSize: 2,

		keyWords: '',

		user: userInfo,
		pageSelected: 'hall'
	},

	beforeMount: function() {
		this.loadHotProject();
		this.loadProject();
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
			if (projectBox.projects.length === 0 && projectBox.hotProjects.length === 0) {
				window.location.reload();
			}
		},

		search: function() {
			//通知projectBox
			bus.$emit('loadProject', this.keyWords);
		}
	}
});

/**
 * [loadProject description]
 * @fileOverview 加载普通project列表
 * @param        {[int]}   pageNum [页码]
 */
function loadProject() {
	if (this.noMore) {
		return;
	}

	let url = `${urlSearchProject}?pageNum=${this.pageNum}&pageSize=${this.pageSize}&keyWords=${this.keyWords}&userid=${this.user.id}`;

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

		if (self.pageNum === 0) {
			self.projects = data.projects;
		} else {
			self.projects = self.projects.concat(data.projects);
		}

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
	let url = `${urlSearchHotProject}?hotSize=${this.hotSize}&keyWords=${this.keyWords}&userid=${this.user.id}`;

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
		data.projects.map((el, index) => {
			el.isHot = true;
			return el;
		});
		self.hotProjects = data.projects;
	});
}