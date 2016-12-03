/**
 * @fileOverview for profile.jsp
 * @Author       adoug
 * @DateTime     2016-11-21
 */

'use strict';

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

let formSerialize = require('../module/formSerialize');

const urlUpdateProfile = `${urlPrefix}/fn/update/profile`;

let appProfile = new Vue({
	el: '#appProfile',
	data: {
		isEditing: false,
		user: userInfo,
		editFail: false
	},
	computed: {
		userSex: function() {
			return this.user.sex === 'boy' ? '男' : '女';
		}
	},
	methods: {
		showEditer: function(params) {
			this.isEditing = true;
		},
		editProfile: function(params) {
			fetch(urlUpdateProfile, {
				method: 'POST',
				headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                credentials: 'same-origin',
                body: formSerialize('#formProfile')
			})
			.then(response => response.json())
			.then(function(data) {
				if (data.code === 'ok') {
					let self = this;
					appProfile.isEditing = false;
				} else {
					appProfile.editFail = true;
				}
			})
			.catch(function(error) {
				appProfile.editFail = true;
				console.log('request failed', error);
			});
		},

		navBack: function() {
			window.history.go(-1);
		},

		closeDialog: function() {
			this.editFail = false;
		}
	}
});