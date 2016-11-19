'use strict';

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlValidUserName = '/fn/valid/userName';

let formRegister = new Vue({
	el: '#formRegister',
	data: {
		userName: '',
		password: '',
        passConfirm: '',
        userNameError: false,
        passError: false
	},
    computed: {
        errorCount: function() {
            let count = 0;
            if (this.userNameError) count++;
            if (this.passError) count++;
            return count;
        },
        errorMsg: function() {
            let msg = '';
            if (this.userNameError) {
                msg = '抱歉，用户名已被注册';
            } else if (this.passError) {
                msg = '两次密码输入不一致';
            }
            return msg;
        },
        hasError: function() {
            return this.userNameError || this.passError;
        }
    },

    methods: {
        validName: function(event) {
            fetch(urlValidUserName, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userName: formRegister.userName
                })
            })
            .then(response => response.json())
            .then(function(data) {
                if (data.code == 'ok') {
                    formRegister.userNameError = false;
                } else {
                    formRegister.userNameError = true;
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
                  userName: formRegister.userName
                })
            })
            .then(response => response.json())
            .then(function(data) {
                if (data.code == 'ok') {
                    formRegister.userNameError = false;
                    formRegister.validPass();
                } else {
                    formRegister.userNameError = true;
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