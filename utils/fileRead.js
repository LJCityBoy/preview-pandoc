const fs = require("fs")

export const utf8Read = (file) => {
    fs.readFile(file,'utf8',(err,data) => {
        if(err) {
            console.log(err)
            return "文件读取错误！"
        }
        else {
            return data
        }
    })
}