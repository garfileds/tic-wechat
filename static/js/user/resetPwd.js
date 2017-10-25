/**
 * Created by adoug on 2017/10/25.
 */

'use strict'

require('whatwg-fetch')

let formResetPwd = new Vue({
  el: '#formResetPwd',
  data: {
    username: '',
    passNew: '',
    passNewConfirm: '',

    inputNull: false,

    userError: false,
    passError: false
  },
  computed: {
    errorCount: function() {
      let count = 0
      if (this.passError) count++
      return count
    },
    errorMsg: function() {
      let msg = ''
      if (this.inputNull) {
        msg = '没有填完哦'
      } else if (this.passError) {
        msg = '两次新密码输入不一致'
      }
      return msg
    },
    hasError: function() {
      return this.passError || this.inputNull
    }
  },

  methods: {
    validPass: function() {
      this.passError = !(this.passNew === this.passNewConfirm)
      return this.passError
    },

    validInputNull: function() {
      this.inputNull = !(!!this.passNew && !!this.passNewConfirm)
      return this.inputNull
    },

    validForm: function() {
      if (this.validInputNull() || this.validPass()) {
        return
      }

      if (!this.hasError) {
        this.$el.submit()
      }
    }
  }
})