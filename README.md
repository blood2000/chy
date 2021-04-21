## 开发

### 项目初始化
```bash
# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

```
### 项目调试配置

- 本地配置环境编写：新建 `.env.development.local` 文件

为了本地开发不与其它开发人员进行混淆环境，故每个本地开发的前端人员可在自己本地新建相关配置文件，这样通过运行统一的运行脚本来满足不同开发人员的需求

`.env.development.local` > `.env.development` > `.env`

其中 .local 不会被 git 接管，也就是它不会被上传到 git，属于本地配置文件

  ```
# 开发环境配置
ENV = 'development'
# 综合服务管理平台/开发环境
VUE_APP_BASE_API = '/dev-api'
# 路由懒加载
VUE_CLI_BABEL_TRANSPILE_MODULES = true
# 接口访问地址，之后若要换成其它人的环境就在这个文件上进行配置
VUE_APP_BASE_HOST = 'http://10.0.0.75:8080'
```

- 启动项目

```
# 本机开发启动
npm run dev

# 测试环境(10.0.0.75)启动
npm run stage
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境(10.0.0.75)
npm run build:stage

# 构建生产环境(互联网环境)
npm run build:prod
```