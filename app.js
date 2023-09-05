const { resolve } = require('path');
const { rejects } = require('assert');
const ProgressBar = require('progress');
const fs = require('fs');
var libqqwry = require('./lib/qqwry');
var qqwry1 = libqqwry();
// 命令行传参--file =
var args = require('minimist')(process.argv.slice(2))
if (!args['file']) {
    console.log('用法：--file=文件路径');
    process.exit();
}

var inputfile = args['file'];
// inputfile = 'ip_test.txt'
outputfile = 'IPv4.json'
console.log('处理文件 ==> ' + inputfile);

// 
// 当然要写一个好看的进度条
// 创建一个新的进度条实例
function progBar(num) {
    const bar = new ProgressBar(':percent [:bar] 查询中', {
        total: num, // 进度条的总数
        width: 60, // 进度条的宽度
        complete: '=',
        incomplete: ' ',
    });
    return bar;
}


// 读取IP文件 

function readLocalFile() {
    // 读取文件的时候是异步，用Promise封装然
    return new Promise(function(resolve, reject) {
        // 用于存储每一行的数据
        var lines = '';
        // 创建可读流并按行处理数据
        const stream = fs.createReadStream(inputfile, 'utf8');
        // 处理流事件 --> data, end, and error
        stream.on('data', (chunk) => {
            // 妈的，在这一步不能将字符串转为数组，勾八异步数据流没读完，只能字符串拼接
            // 将数据拆分成行
            // const parts = chunk.split('\n');

            // // 处理每一行的数据
            // console.log('parts' + parts.length);
            // for (let i = 0; i < parts.length; i++) {
            //     lines.push(parts[i]);
            //     if (i == 4682) {
            //         console.log(parts[4682]);
            //     }
            // }
            lines += chunk;

        });

        stream.on('end', () => {
            // 所有行的数据都已经读取完毕，将数据转换为数组并去掉可能的空格
            const dataArray = lines.split('\n').map((line) => line.trim());
            resolve(dataArray);
            // dataArray 现在包含了每一行的数据作为数组元素
        });

        stream.on('error', (err) => {
            console.error('读取文件出错:', err);
            reject(err);
        });
    });

}
// 写入IP信息
function writeLocalFile(res_dict) {
    new Promise(function(resolve, reject) {
        // 将 JavaScript 对象转换为 JSON 字符串
        const jsonData = JSON.stringify(res_dict[0], null, 2); // 第二个参数是用于缩进的空格数，设置为 2 可以让 JSON 文件更易读
        const stream = fs.createWriteStream(outputfile, 'utf8');
        const stream_error = fs.createWriteStream('error_ipv4.txt', 'utf8');
        //写入文件
        stream.write(jsonData, 'utf8');
        stream_error.write(res_dict[1].join("\r\n").toString(), 'utf8');
        // 标记文件末尾
        stream.end();
        stream_error.end();
        stream.on('finish', () => {
            console.error('正确数据写入已经完成! ==> ' + outputfile);
        });
        stream_error.on('finish', () => {
            console.error('错误数据写入已经完成! ==> error_ipv4.txt');
        });
        stream.on('error', (err) => {
            console.error('正确数据写入文件出错:', err);
            reject(err);
        })
        stream_error.on('error', (err) => {
            console.error('错误数据写入文件出错:', err);
            reject(err);
        })

    });
}
//判断IPv4
function isValidIPv4(ip) {
    // 使用正则表达式匹配 IPv4 地址
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // 使用正则表达式测试输入的字符串
    return ipv4Pattern.test(ip);
}
//单个IP查询
function ipQuery(data) {
    var ip_adds = []; // 正确IPv4
    var ip_errs = []; // 错误IPv4
    var res_dict = []; // 返回
    var bar = progBar(data.length); // 创建进度条
    return new Promise(function(resolve, reject) {
        for (let id = 0; id < data.length; id++) {
            if (isValidIPv4(data[id])) {
                // console.log(qqwry1(data[id]));
                ip_adds.push(qqwry1(data[id]));
            } else {
                ip_errs.push(data[id]);
            }
            bar.tick(); //更新进度条
        }
        res_dict.push(ip_adds);
        res_dict.push(ip_errs);
        resolve(res_dict);
    });
}



// 文件读取函数回调
readLocalFile()
    .then(function(data) {
        // 回调查询
        console.log(data.length + '条数据读取成功，开始查询！');
        return ipQuery(data);
    }).catch(function(err) {
        console.log('\n读取发生错误：' + err)
    })
    .then(function(res_dict) {
        // 回调写入文件
        console.log(res_dict[0].length + '条数据查询成功，开始写入！');
        console.log(res_dict[1].length + '条数据格式错误，开始写入！');
        return writeLocalFile(res_dict);
    }).catch(function(err) {
        console.log('\n查询发生错误：' + err)
    });