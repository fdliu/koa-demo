![img](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGtsYXhtOWoyaWEyZ2w5enI0dnV1dHQ3OWtqZWx5MGN5ZnloMnVxZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TObnkBM4p2bbu6fGdY/giphy.gif)

# koa web 服务器搭建开始
主要依赖：koa，pm2，lowdb

1. pm2守护服务进程，这里选择这个  
    "pm2 start index.js --name koa-demo"
2. nodemon守护  
    "nodemon index.js"  

#安装  
1.npm install       安装package.json里的基础依赖  
2.npm install pm2 -g    全局安装pm2  

启动服务
npm run serve  

pm2 常用命令  

1、启动进程/应用 pm2 start bin/www 或 pm2 start app.js  
2、重命名进程/应用 pm2 start app.js --name wb123  
3、添加进程/应用watch pm2 start bin/www --watch  
4、结束进程/应用 pm2 stop www  
5、结束所有进程/应用 pm2 stop all  
6、删除进程/应用 pm2 delete www  
7、删除所有进程/应用 pm2 delete all  
8、列出所有进程/应用 pm2 list  
9、查看某个进程/应用具体情况 pm2 describe www  
10、查看进程/应用的资源消耗情况 pm2 monit  
11、查看pm2的日志 pm2 logs  
12、若要查看某个进程/应用的日志,使用 pm2 logs www  
13、重新启动进程/应用 pm2 restart www  
14、重新启动所有进程/应用 pm2 restart all  