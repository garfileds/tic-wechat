/**
 * Created by chenpeng on 2017/3/17.
 */
let multilineContent = {
  render: function (createElement) {
      let lines = this.content.split('\n');
      let len = lines.length;
      let linesNew = [];

      while(len--) {
          linesNew.unshift(lines[len], 'br');
      }
      linesNew.pop();

      return createElement(
          'p',
          linesNew.map(function (line) {
              if (line === 'br') {
                  return createElement(line);
              } else {
                  return createElement('span', line);
              }
          })
      );
  },
  props: {
      content: {
          require: true,
          type: String
      }
  }
};

let detailProjectMain = new Vue({
   el: '#detailProjectMain',
   data: {
       project: projectInfo
   },

   components: {
       'multiline-content': multilineContent
   }
});