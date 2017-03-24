/**
 * Created by chenpeng on 2017/3/25.
 */

let Promise = require('es6-promise').Promise;
require('whatwg-fetch');

const urlHasMsg = `${urlPrefix}/fn/hasMsg`;

var app = new Vue({
    el: '#app',

    data: {
        hasMsg: false,

        user: userInfo
    },

    created: function () {
      this.queryHasMsg();
    },

    methods: {
        queryHasMsg: function () {
            var self = this;
            var url = `${urlHasMsg}?userId=${self.user.id}`;

            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => response.json())
                .then(data => {
                    self.hasMsg = data.hasMsg;
                })
                .catch(error => {
                    consol.log('出错了');
                })
        }
    }
});