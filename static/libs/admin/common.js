'use strict';

let app = new Vue({
    el: '#app',

    data: {
        sidePush: false
    },

    methods: {
        push: function() {
            this.sidePush = !this.sidePush;
        }
    }
});