### 把Jav网站连接起来！
一个chrome插件
#### 功能
- 给JavBus, JavLibrary加上快捷播放按钮
  <p>
    <img width="35%" src="./pics/screenshot_javbus.png" >
    <img width="35%" src="./pics/screenshot_javlibrary.png" >
  </p>


#### 使用方法
1. 下载当前项目
2. 打开[扩展程序页面](chrome://extensions/)
3. 右上角勾选开发者模式
4. 加载已解压的扩展程序 -> 选择文件夹

#### 开发引导
1. 支持新的网址
   manifest.json
    content_scripts 包含新文件
    jsoncontent_scripts
      matches 添加网址匹配
    
  content.js 
    javHolders 数组中添加新类