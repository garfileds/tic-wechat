'use strict';

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

let MD5 = require('crypto-js/md5');

const urlValidUser = `${urlPrefix}/fn/valid/user`;

let formResetPass = new Vue({
	el: '#formResetPass',
	data: {
		username: '',
		passOld: '',
        passNew: '',
        passNewConfirm: '',

        inputNull: false,

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
            if (this.inputNull) {
                msg = '表单没有填完哦';
            } else if (this.userError) {
                msg = '用户名或原始密码错误';
            } else if (this.passError) {
                msg = '两次新密码输入不一致';
            }
            return msg;
        },
        hasError: function() {
            return this.userError || this.passError || this.inputNull;
        }
    },

    methods: {
        validUser: function(event) {
            fetch(urlValidUser, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  "username": formResetPass.username,
                  "password": MD5(formResetPass.passOld).toString()
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

        validInputNull: function() {
            this.inputNull = !(!!this.username && !!this.passOld && !!this.passNew && !!this.passNewConfirm);
            return this.inputNull;
        },

        validForm: function(param) {
            if (this.validInputNull() && this.validPass()) {
                return;
            }

            fetch(urlValidUser, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  "username": formResetPass.username,
                  "password": MD5(formResetPass.passOld).toString()
                })
            })
            .then(response => response.json())
            .then(function(data) {
                if (data.code == 'ok') {
                    formResetPass.userError = false;
                    formResetPass.validInputNull();
                    formResetPass.validPass();
                } else {
                    formResetPass.userError = true;
                }

                if (!formResetPass.hasError) {
                    formResetPass.passOld = MD5(formResetPass.passOld).toString();
                    formResetPass.$nextTick(function() {
                        formResetPass.$el.submit();
                    });
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