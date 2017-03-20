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
const urlValidProfile = `${urlPrefix}/fn/valid/profile`;

const multilineContent = {
    render: function (createElement) {
        let lines = this.content.split('\n');
        let len = lines.length;
        let linesNew = [];

        while(len--) {
            linesNew.unshift(lines[len], 'br');
        }
        linesNew.pop();

        return createElement(
            'p',
            linesNew.map(function (line) {
                if (line === 'br') {
                    return createElement(line);
                } else {
                    return createElement('span', line);
                }
            })
        );
    },
    props: {
        content: {
            require: true,
            type: String
        }
    }
};

let appProfile = new Vue({
	el: '#appProfile',
	data: {
		isEditing: false,
		user: userInfo,

		editFail: false,
		editIsSucc: false,

		usernameNullErr: false,
		profileErr: false,
		errorMsg: ''
	},
	computed: {
		userSex: function() {
			return this.user.sex === 'boy' ? '男' : '女';
		},

		hasError: function () {
			return this.usernameNullErr || this.profileErr;
        }
	},
	methods: {
		showEditer: function(params) {
			this.isEditing = true;
		},
		editProfile: function(params) {
			var promiseValidProfile;

			promiseValidProfile = this.validProfile();

			if (this.hasError) {
				window.scroll(0, 0);
				return;
			}

			promiseValidProfile.then(() => {
				this.updateProfile();
			})
			.catch(error => {
				if (error.message.indexOf('Big Error') > -1) {
                    window.scroll(0, 0);
                    console.log('form invalid');
				}
			})
		},

		navBack: function() {
			window.history.go(-1);
		},

		closeDialog: function() {
			this.editFail = false;
		},
		
		updateProfile: function () {
            return fetch(urlUpdateProfile, {
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
		
		validProfile: function () {
			if (!this.user.username) {
				this.errorMsg = '昵称不可为空哦'
				this.usernameNullErr = true;
				return false;
			} else {
				this.usernameNullErr = false;
			}

			return fetch(urlValidProfile, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: tools.formSerialize('#formProfile')
			})
			.then(response => response.json())
			.then(data => {
				if (data.code === 'error') {
                    this.errorMsg = data.comment;
                    this.profileErr = true;
                    throw new Error('Big Error');
                } else {
					this.profileErr = false;
				}
			})
        }
	},

	components: {
		'multiline-content': multilineContent
	}
});