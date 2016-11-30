/**
 * @fileOverview for postProject.jsp
 * @Author       adoug
 * @DateTime     2016-11-30
 */

'use strict';

const Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const tools = require('../module/tools');

const urlPostProject = '/fn/project/post';

Vue.component('tic-tag-box', {
	template: '#tic-tag',

	data: function() {
		return {
			tags: ['Web', '安卓', 'iOS', '硬件', '其他'],
			showTag: true,
			selected: [],
			tagAdded: '',
			isShowTagAdd: false,
			unfold: true
		};
	},

	computed: {
		tagsSelected: function() {
			return this.selected.join('&');
		}
	},

	methods: {
		switchTag: function() {
			this.showTag = !this.showTag;
			this.unfold = !this.unfold;
		},

		isSelected: function(tag) {
			return this.selected.indexOf(tag) > -1;
		},

		tagTap: function(params) {
			var event = params.event,
				target = event.target;

			var tag = target.dataset.tag;

			if (this.selected.indexOf(tag) > -1) {
				let index = this.selected.indexOf(tag);

				this.selected.splice(index, 1);
			} else {
				this.selected.push(tag);
			}
		},

		showTagAdd: function() {
			this.isShowTagAdd = true;
		},

		hideTagAdd: function() {
			this.isShowTagAdd = false;
		},

		addTag: function() {
			this.tags.push(this.tagAdded);
			this.selected.push(this.tagAdded);
			this.isShowTagAdd = false;
			this.tagAdded = '';
		}
	}
});

let appPostProject = new Vue({
	el: '#appPostProject',

	data: {
		postIsFail: false,
		postIsSucc: false
	},

	methods: {
		postProject: function() {
			self = this;

			fetch(urlPostProject, {
				method: 'POST',
				headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                credentials: 'same-origin',
                body: tools.formSerialize('#formPostProject')
			})
			.then(response => response.json())
			.then(function(data) {
				if (data.code === 'ok') {
					self.postIsSucc = true;
					window.location.href = '/myProject/myPost';
				} else {
					self.postIsFail = true;
				}
			})
			.catch(function(error) {
				self.postIsFail = true;
				console.log('request failed', error);
			});
		},

		navBack: function() {
			window.history.go(-1);
		},

		closeDialog: function() {
			this.postIsFail = false;
		}
	}
});