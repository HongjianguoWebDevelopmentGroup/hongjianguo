//验证是否登陆并获得一些基础资源信息,若获取失败则直接跳转至登陆页面
$.ajax({
  url: '/api/userinfo',
  type: 'GET',
  async: false,
  success: function (_) {
    if (_.status) {
      if(!window.appCache) {
        window.appCache = {};
      }
      window.appCache.userinfo = _.member;
    }else {
     window.location.href = '/login';
    }
  },
  error: function (_) {
    window.location.href = '/login';
  }
})