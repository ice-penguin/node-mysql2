/**
 * 生成自己想要的工具，暴露初始化表方法
 */
let client = require('../index')({
    host     : "10.0.65.237",
    port     : "3306",
    user     : "root",
    password : "123456",
    database : "tools",
    connectTimeout : 100000//超时时长，毫秒
});

module.exports = client.Table;