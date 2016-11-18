fis.require('jello')(fis);

/****************环境变量*****************/
fis
  // 排除指定目录
  .set('project.files', ['**', '.**', '.**/**'])
  .set('project.ignore', ['dev/**', 'prod/**', 'node_modules/**', '.gitignore', '**/_*.scss', '.docs/**', '.dist/**', '.git/**', '.svn/**', 'fis-conf.js'])
  .set('project.fileType.text', 'es');


/****************单文件处理插件*****************/
// 标记 staitc/js 下面的 js 为模块化代码。
fis.match('/static/js/**.js', {
  isMod: true,
  parser: fis.plugin('babel-5.x', {
      blacklist: ['regenerator'],
      stage: 3
  }),
  rExt: 'js'
});

// 设置 *.scss 配置配置项
fis.match('/static/stylesheets/**.scss', {
  isMod: true,
  rExt: '.css',
  parser: fis.plugin('node-sass')
});


/****************prod环境*****************/
fis.media('prod')
  .match('::package', {
    packager: fis.plugin('deps-pack', {
      
    })
  });
