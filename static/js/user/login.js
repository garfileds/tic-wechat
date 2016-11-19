'use strict';

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlValidUser = '/fn/valid/user';

let formRegister = new Vue({
	el: '#formLogin',
	data: {
		hasError: false,
		userName: '',
		password: ''
	},
    methods : {
        validUser: function(params) {
            fetch(urlValidUser, {
                method: 'POST',
                credentials: 'same-origin',
                body: new FormData(formRegister.$el)
            })
            .then(response => response.json())
            .then(function(data) {
                if (data.code == 'ok') {
                    formRegister.$el.submit();
                } else {
                    formRegister.hasError = true;
                }
            })
            .catch(function(error) {
                console.log('request failed', error);
            });

            params.event.preventDefault();
        }
    }
});