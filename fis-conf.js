fis.require('jello')(fis);

/****************环境变量*****************/
fis
  // 排除指定目录
  .set('project.files', ['/docs/**', '/static/**', '/page/**', '/test/**', '/map.json', 'server.conf'])
  .set('project.ignore', ['/dev/**', 'prod/**', 'tic/**', 'prod-tic/**'])
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

fis.match('{/static/js/**.js, /page/**.js}', {
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

fis.match('/page/**.js', {
  isMod: false
});

fis.media('tic')
  .match('**.{scss, css, js, png, jpeg, jpg}', {
    url: '/xdtic$0'
  })
  .match('node_modules/**.{js, es}', {
    url: '/xdtic/static$0'
  })
  .match('page/**.{scss, css, js}', {
    url: '/xdtic/static$0'
  })
  .match('**/fonts/**.{eot, woff2, woff, ttf, svg}', {
    url: '/xdtic$0'
  });



/****************prod环境*****************/
fis.media('prod')
  .match('**.jsp', {
    'isHtmlLike': true
  })
  .match('::package', {
    packager: fis.plugin('deps-pack', {
      'pkg/js/main.js': [
        '/static/libs/common.js',
        'static/libs/mod.js',
        '/static/libs/vue.js',
        '/static/libs/vue-tap.js'
      ],

      'pkg/js/module.js': [
        '/static/js/hall/hall.js:deps',
        '/static/js/user/user.js:deps',
        '/static/js/user/login.js:deps',
        '/static/js/user/msgs.js:deps',
        '/static/js/user/profile.js:deps',
        '/static/js/user/register.js:deps',
        '/static/js/user/resetPass.js:deps',
        '/static/myProject/myProject.js:deps',
        '/static/myProject/postProject.js:deps',
        '/static/myProject/myPost/signDetail.js:deps',
        '/static/myProject/myPost/editDetail.js:deps',
        '/static/myProject/myCollect/toJoin.js:deps'
      ],

      'pkg/js/hall/hall.js': [
        '/static/js/hall/hall.js'
      ],

      'pkg/js/user/login.js': [
        '/static/js/user/login.js'
      ],

      'pkg/js/user/msgs.js': [
        '/static/js/user/msgs.js'
      ],

      'pkg/js/user/profile.js': [
        '/static/js/user/profile.js'
      ],

      'pkg/js/user/register.js': [
        '/static/js/user/register.js'
      ],

      'pkg/js/user/resetPass.js': [
        '/static/js/user/resetPass.js'
      ],

      'pkg/js/user/center.js': [
        '/static/js/user/center.js'
      ],

      'pkg/myProject/myProject.js': [
        '/static/myProject/myProject.js'
      ],

      'pkg/myProject/postProject.js': [
        '/static/myProject/postProject.js'
      ],

      'pkg/myProject/myPost/editDetail.js': [
        '/static/myProject/myPost/editDetail.js'
      ],

      'pkg/myProject/myPost/signDetail.js': [
        '/static/myProject/myPost/signDetail.js'
      ],

      'pkg/myProject/myCollect/toJoin.js': [
        '/static/myProject/myCollect/toJoin.js'
      ],

      'pkg/css/main.css': [
        '/static/scss/weui.css',
        '/static/scss/common.scss',
        '/page/widget/footer/nav.scss'
      ]
    })
  })
  .match('/pkg/**.{js, es}', {
    useHash: true/*,

     optimizer: fis.plugin('uglify-js')*/
  })
  .match('/pkg/**.{scss ,css}', {
    useHash: true/*,

     optimizer: fis.plugin('clean-css',{
     //option
     })*/
  });

fis.media('prod-tic')
  .match('**.jsp', {
    'isHtmlLike': true
  })
  .match('::package', {
    packager: fis.plugin('deps-pack', {
      'pkg/js/main.js': [
        '/static/libs/common.js',
        '/static/libs/mod.js',
        '/static/libs/vue.js',
        '/static/libs/vue-tap.js'
      ],

      'pkg/js/module.js': [
        '/static/js/hall/hall.js:deps',
        '/static/js/user/login.js:deps',
        '/static/js/user/msgs.js:deps',
        '/static/js/user/profile.js:deps',
        '/static/js/user/register.js:deps',
        '/static/js/user/resetPass.js:deps',
        '/static/js/user/center.js:deps',
        '/static/myProject/myProject.js:deps',
        '/static/myProject/postProject.js:deps',
        '/static/myProject/myPost/editDetail.js:deps',
        '/static/myProject/myCollect/toJoin.js:deps'
      ],

      'pkg/js/hall/hall.js': [
        '/static/js/hall/hall.js'
      ],

      'pkg/js/user/login.js': [
        '/static/js/user/login.js'
      ],

      'pkg/js/user/msgs.js': [
        '/static/js/user/msgs.js'
      ],

      'pkg/js/user/profile.js': [
        '/static/js/user/profile.js'
      ],

      'pkg/js/user/register.js': [
        '/static/js/user/register.js'
      ],

      'pkg/js/user/resetPass.js': [
        '/static/js/user/resetPass.js'
      ],

      'pkg/js/user/center.js': [
        '/static/js/user/center.js'
      ],

      'pkg/myProject/myProject.js': [
        '/static/myProject/myProject.js'
      ],

      'pkg/myProject/postProject.js': [
        '/static/myProject/postProject.js'
      ],

      'pkg/myProject/myPost/editDetail.js': [
        '/static/myProject/myPost/editDetail.js'
      ],

      'pkg/myProject/myCollect/toJoin.js': [
        '/static/myProject/myCollect/toJoin.js'
      ],

      'pkg/css/main.css': [
        '/static/scss/weui.css',
        '/static/scss/common.scss',
        '/page/widget/footer/nav.scss'
      ]
    })
  })
  .match('/pkg/**.{js, es}', {
    useHash: true/*,

    optimizer: fis.plugin('uglify-js')*/
  })
  .match('/pkg/**.{scss ,css}', {
    useHash: true/*,
    
    optimizer: fis.plugin('clean-css',{
        //option
    })*/
  })
  .match('**.{scss, css, js, png, jpeg, jpg}', {
    url: '/xdtic$0'
  })
  .match('{node_modules/**.{js, es}, pkg/**.{js, css}}', {
    url: '/xdtic/static$0'
  })
  .match('page/**.{scss, css, js}', {
    url: '/xdtic/static$0'
  })
  .match('**/fonts/**.{eot, woff2, woff, ttf, svg}', {
    url: '/xdtic$0'
  });
