# ipQuery

## 基于纯真IP数据库的IP批量查询归属地工具

基于 [cnwhy/lib-qqwry](https://github.com/cnwhy/lib-qqwry/) 二次开发，编译了可执行文件 ipQuery/build

输入：ip文件，一行一个

输出：json格式的文件

使用：

```
ipQuery --file=ipfilename
```

```
node app.js --file=ipfilename
```

![image-20230905140300558](https://cdn.jsdelivr.net/gh/orzchen/Blog/images/image-20230905140300558.png)

GetAddr4Json.py 解析json的脚本