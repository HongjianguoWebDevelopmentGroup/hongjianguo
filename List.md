# 前端问题清单
----------------------
- 页面位置:&nbsp;\application\index\view\test
- static文件夹位置:&nbsp;\public\static
- 更新:&nbsp;前台代码打包后(记得注释掉APP.VUE下面的模拟请求发送代码)，将打包获得的dist文件夹下的index.html覆盖页面位置下的index.html，static下的内容覆盖static文件夹位置里面的内容
- git上传:
  1. git pull \[name\] \[branch\]
  2. git add \*(或者精确到文件夹或文件)
  3. git commit -m '注释'(这里是简便写法，也可以使用git commit -a 之后到编辑器编辑更加完整的注释)
  4. git push \[name\] \[branch\]
----------------------
>1. 登录界面去掉记住密码选项,同时登录错误的信息提示换一种更友好的方式展示
