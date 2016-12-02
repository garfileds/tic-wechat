'use strict';

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlValidUserName = `${urlPrefix}/fn/valid/username`;

let formRegister = new Vue({
	el: '#formRegister',
	data: {
		username: '',
		password: '',
        passConfirm: '',
        usernameError: false,
        passError: false
	},
    computed: {
        errorCount: function() {
            let count = 0;
            if (this.usernameError) count++;
            if (this.passError) count++;
            return count;
        },
        errorMsg: function() {
            let msg = '';
            if (this.usernameError) {
                msg = '抱歉，用户名已被注册';
            } else if (this.passError) {
                msg = '两次密码输入不一致';
            }
            return msg;
        },
        hasError: function() {
            return this.usernameError || this.passError;
        }
    },

    methods: {
        validName: function(event) {
            fetch(urlValidUserName, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  username: formRegister.username
                })
            })
            .then(response => response.json())
            .then(function(data) {
                if (data.code == 'ok') {
                    formRegister.usernameError = false;
                } else {
                    formRegister.usernameError = true;
                }
            })
            .catch(function(error) {
                console.log('request failed', error);
            });
        },

        validPass: function() {
            this.passError = !(this.password === this.passConfirm);
            return this.passError;
        },

        validRegister: function(param) {
            fetch(urlValidUserName, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  username: formRegister.username
                })
            })
            .then(response => response.json())
            .then(function(data) {
                if (data.code == 'ok') {
                    formRegister.usernameError = false;
                    formRegister.validPass();
                } else {
                    formRegister.usernameError = true;
                }

                if (!formRegister.hasError) {
                    formRegister.$el.submit();
                }
            })
            .catch(function(error) {
                console.log('request failed', error);
            });
        }
    }
});