fis.require('jello')(fis);

/****************环境变量*****************/
fis
  // 排除指定目录
  .set('project.files', ['**', '.**', '.**/**'])
  .set('project.ignore', ['tic/**', '.idea/**', 'dev/**', 'prod/**', 'node_modules/**', '.gitignore', '**/_*.scss', '.docs/**', '.dist/**', '.git/**', '.svn/**', 'fis-conf.js'])
  .set('project.fileType.text', 'es');


/****************单文件处理插件*****************/
//node_module require支持
fis.hook('commonjs', {
  extList: ['.js', '.jsx', '.es', '.ts', '.tsx']
});


fis.unhook('components');
fis.hook('node_modules');
fis.match('node_modules/**.js', {
    isMod: true
});

fis.match('/static/js/**.js', {
  parser: fis.plugin('babel-5.x', {
      blacklist: ['regenerator'],
      stage: 3
  }),
  rExt: 'js'
});

// 标记 staitc/js/module 下面的 js 为模块化代码。
fis.match('/static/js/module/**.js', {
  isMod: true
});

// 设置 *.scss 配置配置项
fis.match('/static/scss/**.scss', {
  isMod: true,
  rExt: '.css',
  parser: fis.plugin('node-sass')
});

fis.media('tic')
  /*.match('**', {
      release: 'D:/freetime/xdtic-be/src/main/webapp/static/$0'
    })
  .match('/static/(**)', {
      release: 'D:/freetime/xdtic-be/src/main/webapp/static/$1'
    })
  .match('/page/**.{jsp,vm,html}', {
      release: 'D:/freetime/xdtic-be/src/main/webapp/WEB-INF/views/$0'
    })
  .match('{map.json,${namespace}-map.json}', {
      release: 'D:/freetime/xdtic-be/src/main/webapp/WEB-INF/config/$0'
    })*/
  .match('**.{scss, css, js, png, jpeg, jpg}', {
    url: '/xdtic$0'
  })
  .match('node_modules/**.{js, es}', {
    url: '/xdtic/static$0'
  });



/****************prod环境*****************/
fis.media('prod')
  .match('::package', {
    packager: fis.plugin('deps-pack', {
      'pkg/js/main.js': [
        '/static/libs/vue.js',
        '/static/libs/vue-tap.js'
      ],
      'pkg/css/main.css': [
        '/static/scss/weui.css',
        '/static/scss/common.scss',
        '/page/widget/footer/nav.scss'
      ]
    })
  });
