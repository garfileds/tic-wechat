/**
 * @fileOverview for /project/check.jsp
 * @Author       adoug
 * @DateTime     2017-2-23
 */

'use strict';

const infiniteScroll = require('vue-infinite-scroll').infiniteScroll;

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlGetUser = `${urlPrefix}/fn/admin/get/user`;
const urlDeleteUser = `${urlPrefix}/fn/admin/user/delete`;

let pageNum = 0;
const pageSize = 8;

Vue.component('tic-user', {
	template: '#tic-project-look',
	props: ['user', 'index'],

	data: function() {
		return {
			checked: false
		};
	},

	watch: {
		checked: function(newChecked) {
			this.$emit('checked', newChecked, this.index);
		}
	}
});

let projectBox = new Vue({
	el: '#app',
	data: {
		users: [],
		busy: false,
		noMore: false,
		isLoading: false,
		checkImmediately: false,

		sidePush: false,

		placeholder: '你想要的用户...',
		keyWords: '',

		checkedUser: []
	},

	computed: {
		hasUser: function() {
			return this.users.length > 0;
		},

		hasChecked: function() {
			return this.checkedUser.length > 0;
		}
	},

	beforeMount: function() {
		loadMore.call(this);
	},

	methods: {
		loadMore: loadMore,

		push: function() {
            this.sidePush = !this.sidePush;
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

        //维护选中用户列表
        updateChecked: function(isChecked, userIndex) {
        	let uid = this.users[userIndex].id;
        	if (isChecked) {
        		this.checkedUser.push(uid);
        	} else {
        		let indexOfUid = this.checkedUser.indexOf(uid);
        		this.checkedUser.splice(indexOfUid, 1);
        	}
        },

        deleteUser: function() {
        	let self = this;

        	if (confirm('你确定要删除指定的用户吗？')) {
        		requestDeleteUser(self, this.checkedUser);
        	}
        },

        deleteAll: function() {
        	let self = this;
        	if (confirm('你确定要删除所有用户吗？')) {
        		requestDeleteUser(self, 'All');
        	}
        },

        addUser: function() {
        	
        }
	},

	directives: {infiniteScroll}
});

function loadMore() {
	if (this.noMore) {
		return;
	}

	let url = `${urlGetUser}?pageNum=${pageNum}&size=${pageSize}&keyWords=${this.keyWords}`;

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

		self.users = self.users.concat(data.users);

		if (data.hasMore === false) {
			self.noMore = true;
		}

		pageNum++;
		self.busy = false;
	});
}

/**
 * @fileOverview 向后台请求删除用户
 * @param        {[Array|String]}   uid [用户id的数组或者All表示删除所有]
 */
function requestDeleteUser(app, uid) {
	fetch(urlDeleteUser, {
		method: 'POST',
		headers: {
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			"uid": uid
		})
	})
	.then(response => response.json())
	.then(function(data) {
		if (data.code === 'ok') {
			//更新app.users
			for (let index in app.checkedUser) {
				let uid = app.checkedUser[index];

				for (let elIndex in app.users) {
					let elId = app.users[elIndex].id;
					if (elId === uid) {
						app.users.splice(elIndex, 1);
						break;
					}
				}
			}
		} else {
			alert('网络错误，请稍后重试。');
		}
	})
	.catch(function(error) {
		alert('网络错误，请稍后重试。');
	});
}