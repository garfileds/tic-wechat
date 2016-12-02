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

let pageNum = 0;
const pageSize = 8;

Vue.component('tic-msg', {
	template: '#tic-msg',
	props: ['msg']
});

let msgBox = new Vue({
	el: '#appBody',
	data: {
		msgs: [],
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
		loadMore: loadMore
	},

	directives: {infiniteScroll}
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
		self.isLoading = false;
		self.msgs = self.msgs.concat(data.msgs);

		if (data.hasMore === false) {
			self.noMore = true;
		}

		pageNum++;
		self.busy = false;
	});
}