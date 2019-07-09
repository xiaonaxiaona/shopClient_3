module.exports = {
  presets: [
    '@vue/app'
  ],
  "plugins": [
    ["component", {
      "libraryName": "mint-ui",  //实现按需引入
      "style": true
    }]
  ]
}
