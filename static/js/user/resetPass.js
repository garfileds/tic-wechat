'use strict';

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlValidUserName = `${urlPrefix}/fn/valid/user`;

let formResetPass = new Vue({
	el: '#formResetPass',
	data: {
		username: '',
		passOld: '',
        passNew: '',
        passNewConfirm: '',
        userError: false,
        passError: false
	},
    computed: {
        errorCount: function() {
            let count = 0;
            if (this.userError) count++;
            if (this.passError) count++;
            return count;
        },
        errorMsg: function() {
            let msg = '';
            if (this.usernameError) {
                msg = '用户名或原始密码错误';
            } else if (this.passError) {
                msg = '两次新密码输入不一致';
            }
            return msg;
        },
        hasError: function() {
            return this.userError || this.passError;
        }
    },

    methods: {
        validUser: function(event) {
            fetch(urlValidUserName, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  username: formResetPass.username,
                  password: formResetPass.passOld
                })
            })
            .then(response => response.json())
            .then(function(data) {
                if (data.code == 'ok') {
                    formResetPass.userError = false;
                } else {
                    formResetPass.userError = true;
                }
            })
            .catch(function(error) {
                console.log('request failed', error);
            });
        },

        validPass: function() {
            this.passError = !(this.passNew === this.passNewConfirm);
            return this.passError;
        },

        validForm: function(param) {
            fetch(urlValidUserName, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  username: formResetPass.username,
                  password: formResetPass.passOld
                })
            })
            .then(response => response.json())
            .then(function(data) {
                if (data.code == 'ok') {
                    formResetPass.userError = false;
                    formResetPass.validPass();
                } else {
                    formResetPass.userError = true;
                }

                if (!formResetPass.hasError) {
                    formResetPass.$el.submit();
                }
            })
            .catch(function(error) {
                console.log('request failed', error);
            });
        },

        navBack: function() {
            window.history.go(-1);
        }
    }
});