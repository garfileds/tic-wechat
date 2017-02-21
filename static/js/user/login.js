'use strict';

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

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
    methods : {
        validUser: function(params) {
            fetch(urlValidUser, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                credentials: 'same-origin',
                body: formSerialize(formLogin.$el)
            })
            .then(response => response.json())
            .then(function(data) {
                if (data.code === 'ok') {
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