module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
   plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
     }, 'vant'],
     [
      'component-scss',
      {
        libraryName: 'element-ui',
				styleLibraryName: 'theme-chalk/src',
				ext: '.scss'
      }
    ]
  ]
}
