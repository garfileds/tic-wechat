/**
 * @fileOverview for /project/check.jsp
 * @Author       adoug
 * @DateTime     2017-2-23
 */

'use strict';

let projectBox = new Vue({
	el: '#app',
	data: {
		sidePush: false,

		placeholder: '随心所搜...',

		keyWords: ''
	},

	methods: {
		push: function() {
            this.sidePush = !this.sidePush;
        }
	}
});