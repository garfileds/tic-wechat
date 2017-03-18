/**
 * @fileOverview for hall.jsp
 * @Author       adoug
 * @DateTime     2016-11-24
 */

'use strict';

const infiniteScroll = require('vue-infinite-scroll');
Vue.use(infiniteScroll);

const Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const tools = require('../module/tools');

const urlCollect = `${urlPrefix}/fn/project/collect`;
const urlUnCollect = `${urlPrefix}/fn/project/uncollect`;
const urlOperate = `${urlPrefix}/fn/user/project/operate`;

const urlLoadProjectMap = {
	'post': `${urlPrefix}/fn/get/project/myPost`,
	'join': `${urlPrefix}/fn/get/project/myJoin`,
	'collect': `${urlPrefix}/fn/get/project/myCollect`
};

let myProjectType = tools.getParams(window.location.href).type;
let urlLoadProject = urlLoadProjectMap[myProjectType];

//组件间通信，事件代理
let bus = new Vue();

//searchBar接收请求操作后通知projectBox
bus.$on('loadProject', function(type) {
	projectBox.pageNum = 0;

	projectBox.myProjectType = type;
	projectBox.urlLoadProject = urlLoadProjectMap[type];
	projectBox.projects.splice(0, projectBox.projects.length);

	projectBox.noMore = false;
	projectBox.busy = false;
	projectBox.isLoading = false;
	projectBox.checkImmediately = false;

	projectBox.collectIsFail = false;

	projectBox.loadProject();
});

Vue.component('tic-project', {
	template: '#tic-project',

	props: ['project', 'index', 'userid', 'projecttype'],

	methods: {
		collect: function(params) {
			//假装收藏成功，这样给用户的反馈快一点，失败再回滚
			this.$emit('collect', params.projectIndex);
			let self = this;

			let url = `${urlCollect}?userid=${params.userid}&proId=${this.project.proId}`;
			fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				}
			})
			.then(response => response.json())
			.then(function(data) {
				if (data.code === 'error') {
					self.$emit('uncollect', params.projectIndex);
					self.$emit('collectfail');
				}
			});
		},

		uncollect: function(params) {
			//假装取消收藏，这样给用户的反馈快一点，失败再回滚
			this.$emit('uncollect', params.projectIndex);

			let self = this;

			let url = `${urlUnCollect}?userid=${params.userid}&proId=${this.project.proId}`;
			fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				}
			})
			.then(response => response.json())
			.then(function(data) {
				if (data.code === 'error') {
					self.$emit('collect', params.projectIndex);
					self.$emit('collectfail');
				}
			});
		},

		deletePost: function () {
			if (confirm('你确定要终止该项目吗？')) {
                this.$emit('deletepost', this.index);
            }
        }
	},

	computed: {
		projectStatu: function() {
			if (this.project.statu) {
				return this.project.statu === 'pass' ? '审核已通过~'
					: this.project.statu === 'reject' ? '审核被拒' : '审核中...';
			}
			return '';
		},

		projectDetailLink: function() {
			if (this.projecttype === 'post') {
				return `${urlPrefix}/myProject/myPost/detail`;
			}

			if (this.projecttype === 'collect') {
				return `${urlPrefix}/project`;
			}

			if (this.projecttype === 'join') {
				return `${urlPrefix}/project`;
			}
		}
	}
});

let projectBox = new Vue({
	el: '#appBody',
	data: {
		projects: [],

		busy: false,
		noMore: false,
		isLoading: false,
		checkImmediately: false,

		collectIsFail: false,

		pageNum: 0,
		pageSize: 5,

		myProjectType: myProjectType,
		urlLoadProject: urlLoadProject,

		user: userInfo,
		pageSelected: 'myProject'
	},

	beforeMount: function() {
		this.loadProject();
	},

	methods: {
		loadProject: loadProject,

		collect: function(index) {
			this.projects[index].isCollected = true;
		},

		uncollect: function(index) {
			this.projects[index].isCollected = false;
		},

		closeDialog: function() {
			this.collectIsFail = false;
		},

		openDialog: function() {
			this.collectIsFail = true;
		},

		deletePost: function (index) {
			let project = this.projects[index];

			fetch(urlOperate, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
                body: JSON.stringify({
                    "operation": 'delete',
                    "proId": project.proId,
                }),
                credentials: 'same-origin'
			})
			.then(response => response.json())
			.then(data => {
				if (data.code === 'ok') {
                    this.projects.splice(index, 1);
                } else {
					alert('终止项目失败，请稍后重试。');
				}
			})
			.catch(error => {
				alert('出错了，请稍后重试。');
			});
        }
	}
});

let myProjectNav = new Vue({
	el: '#myProjectNav',

	data: {
		currentLink: myProjectType
	},

	methods: {
		switchType: function(params) {
			let event = params.event,
				target = event.target;

			this.currentLink = target.dataset.type;
			bus.$emit('loadProject', target.dataset.type);
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

	let url = `${this.urlLoadProject}?pageNum=${this.pageNum}&pageSize=${this.pageSize}&uid=${this.user.id}`;

	this.busy = true;
	this.isLoading = true;
	let self = this;

	fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json'
		}
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