'use strict';

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

let MD5 = require('crypto-js/md5');

let formSerialize = require('../module/formSerialize');
let tools = require('../module/tools');

const urlValidUser = `${urlPrefix}/fn/valid/user`;

let formLogin = new Vue({
	el: '#formLogin',
	data: {
		hasError: false,
		username: '',
		password: ''
	},

    computed: {
        md5Pass: function() {
            return MD5(this.password);
        }
    },

    methods : {
        validUser: function(params) {
            fetch(urlValidUser, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                credentials: 'same-origin',
                body: tools.obj2form({
                    username: this.username,
                    password: this.md5Pass
                })
            })
            .then(response => response.json())
            .then(function(data) {
                if (data.code === 'ok') {
                    this.password = MD5(this.password);
                    formLogin.$el.submit();
                } else {
                    formLogin.hasError = true;
                }
            })
            .catch(function(error) {
                console.log('request failed', error);
            });

            params.event.preventDefault();
        }
    }
});