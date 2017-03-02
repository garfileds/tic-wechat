/**
 * @fileOverview for msgs.jsp
 * @Author       adoug
 * @DateTime     2016-11-23
 */

'use strict';

const infiniteScroll = require('vue-infinite-scroll').infiniteScroll;

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlLoadMoreMsg = `${urlPrefix}/fn/get/msg`;
const urlReadMsg = `${urlPrefix}/fn/read/msg`;

const urlProjectSign = `${urlPrefix}/project`;
const urlProjectPost = `${urlPrefix}/myProject/myPost/detail`;

let pageNum = 0;
const pageSize = 8;

let bus = new Vue();

bus.$on('readAll', function() {
	msgBox.readAllMsg();
});

Vue.component('tic-msg', {
	template: '#tic-msg',
	props: ['msg', 'index'],

	methods: {
		readMsg: function(params) {
			var jumpUrl;

			if (this.msg.type === '') {
				jumpUrl = `${urlProjectSign}?uid=${this.msg.uid}&proId=${this.msg.proId}`;
			} else {
				jumpUrl = `${urlProjectPost}?uid=${this.msg.uid}&proId=${this.msg.proId}`;
			}

			if (this.msg.read) {
				window.location.href = jumpUrl;
			}

			//先假装信息已读，若通信失败回滚
			this.$emit('read', params.msgIndex);

			let self = this;

			fetch(urlReadMsg, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				credentials: 'same-origin',
				body: JSON.stringify({
					mid: [self.msg.mid]
				})
			})
			.then(response => response.json())
			.then(function(data) {
				if (data.code === 'error') {
					self.$emit('unread', params.msgIndex);
					alert('网络出问题了，请稍后重试');
				} else {
					window.location.href = jumpUrl;
				}
			})
			.catch(function(error) {
				self.$emit('unread', params.msgIndex);
				alert('网络出问题了，请稍后重试');
			});
		}
	}
});

let msgBox = new Vue({
	el: '#appBody',
	data: {
		msgs: [],
		msgsUnread: [],

		busy: false,
		noMore: false,
		isLoading: false,
		checkImmediately: false,
		user: userInfo
	},

	beforeMount: function() {
		loadMore.call(this);
	},

	methods: {
		loadMore: loadMore,

		readMsg: function(msgIndex) {
			this.msgs[msgIndex].read = true;
		},

		unreadMsg: function(msgIndex) {
			this.msgs[msgIndex].read = false;
		},

		readAllMsg: function() {
			var self = this;

			fetch(urlReadMsg, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				credentials: 'same-origin',
				body: JSON.stringify({
					mid: self.msgsUnread
				})
			})
			.then(response => response.json())
			.then(function(data) {
				if (data.code === 'error') {
					alert('网络出问题了，请稍后重试');
				} else {
					self.msgs = self.msgs.map(function(msg, index) {
						msg.read = true;
						return msg;
					});
				}
			})
			.catch(function(error) {
				alert('网络出问题了，请稍后重试');
			});
		}
	},

	directives: {infiniteScroll}
});

let msgHeader = new Vue({
	el: '#appHeader',

	methods: {
		readAllMsgNotice: function() {
			if (confirm('你确定要标记所有消息为已读吗？')) {
				bus.$emit('readAll');
			}
		}
	}
});

function loadMore() {
	if (this.noMore) {
		return;
	}

	let url = `${urlLoadMoreMsg}?uid=${this.user.id}&pageNum=${pageNum}&size=${pageSize}`;

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
		var newUnreadMsg,
			newMsgs = data.msgs;

		self.isLoading = false;
		self.msgs = self.msgs.concat(data.msgs);

		//记录未读消息
		newUnreadMsg = newMsgs.filter(function(msg, index) {
			return !msg.read;
		});
		newUnreadMsg = newUnreadMsg.map(function(msg) {
			return msg.mid;
		});

		self.msgsUnread = self.msgsUnread.concat(newUnreadMsg);

		if (data.hasMore === false) {
			self.noMore = true;
		}

		pageNum++;
		self.busy = false;
	});
}