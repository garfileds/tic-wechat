/**
 * @fileOverview for profile.jsp
 * @Author       adoug
 * @DateTime     2016-11-21
 */

'use strict';

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

let tools = require('../module/tools');

const urlUpdateProfile = `${urlPrefix}/fn/update/profile`;

let appProfile = new Vue({
	el: '#appProfile',
	data: {
		isEditing: false,
		user: userInfo,

		editFail: false,
		editIsSucc: false
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
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: tools.formSerialize('#formProfile')
			})
			.then(response => response.json())
			.then(function(data) {
				if (data.code === 'ok') {
					let self = this;
					appProfile.editIsSucc = true;

					setTimeout(() => {
						appProfile.isEditing = false;
						appProfile.editIsSucc = false;
					}, 500);
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