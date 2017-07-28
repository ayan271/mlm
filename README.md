# jm-oms-console
运营管理系统后台模板

## 容器配置

环境变量
StaticHost  静态网址Host
StaticPort  静态网址端口
ApiHost     api网址Host
ApiPort     api网址端口
APPS        项目，以空格间隔，不要包含common main dashboard

映射目录
支持自动复制所有项目文件到指定映射目录
如果映射了目录 /app/dist
容器启动后会自动把项目文件复制到/app/dist目录

## 项目简介：
jm-oms-console是基于angularJS的适用于制作管理系统的前端框架，用户使用此框架只需要在src/apps文件夹下增加自己特有的功能模
块，就可以轻松完成管理系统的制作。项目维护只需要管理用户自己增加的那部分功能模块，因为我们将功能和框架进行了很好的分离。
用户只需要将本文件夹下载下来，然后导入项目所依赖的库文件就可以开始自己的开发了（依赖库的导入后面细说）。

##功能特色：
1、对与具体功能无关的样式及配置文件做了很好的封装，实现了低耦合；
2、内置大量常用插件，轻松实现常用效果

## 用法：
1、从https://github.com/jm-root/jm-oms-console.git将项目下载下来
2、接下来安装项目的依赖库，先安装grunt:
npm install -g grunt
在bower.json的同级目录下执行命令：
bower install
grunt copy：libs
在package.json的同级目录下执行命令：
npm install
grunt copy：libs
打包
grunt
3、在src/apps文件夹中增加自己的子模块，每一个子模块至少应该包含tpl,js和l10n三个文件夹，分别存放模板、js文件和翻译文件，
js文件中必须包含自己的路由文件。公用的模板、图片、js以及库文件放在common中，各功能特有的文件建立libs文件夹放在自己对应的
文件夹下。

## 模块说明：
grunt:存放一些用于管理代码的文件
libs:存放项目公共的依赖包
src:存放用户独有的功能模块
