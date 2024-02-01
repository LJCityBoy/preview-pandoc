const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const app = express();
app.use(cors()); //允许跨域

// 文件临时中转
const temUpload = multer({ dest: "uploads/", encoding: "utf8" });

// docx转html格式
app.post("/doc2html", temUpload.single("file"), (req, res) => {
   //创建一个路径，用于存放输出后的media
   fs.mkdir("./outputs/outputs", (err) => {
    console.log(err);
  });
  //   临时文件路径
  const inputFilePath = `${req.file.path}`;
  //   文件名
  const _names = req.file.originalname.split(".");
  const fileName = _names[_names.length - 2];
  //   输出路径
  const outputFilePath = `./outputs/${fileName}.html`;
  //   给临时文件重新命名，并删除临时文件
  const newFilePath = `./uploads/${fileName}.docx`;
 
  fs.rename(inputFilePath, newFilePath, (err) => {
    if (err) {
      return res.status(500).end();
    } else {
      //--self-contained 将所有相关资源（如图片）嵌入到生成的HTML中，以便将其作为单个页面共享而不依赖外部文件
      //--toc 输出目录，会自动跟进docx生成目录 --toc-depth=3 这个应该是表示最多识别到3级目录
      //--extract-media=./outputs/HTML 媒体资源（如图片等）单独输出到一个文件夹
      //--ascii 指定编码为ASCII
      // const command =
      //   req.body.command ||
      //   `pandoc -s ${newFilePath} -t html -o ${outputFilePath} --extract-media=./outputs/HTML --to=html-native_divs-native_spans --toc`;

      const command =
        req.body.command ||
        `pandoc -s ${newFilePath} -t html -o ${outputFilePath} --extract-media=./outputs/HTML --to=html-native_divs-native_spans --toc`;

      // console.log(command);

      //   拿到文件以及文件转换命令，调用pandoc命令进行文件转换工作
      exec(command, async (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          return res.status(500).end();
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        //转换成功后移动media资源文件，避免html中相对路径读取不到media资源
        fs.rename("./outputs/HTML", "./outputs/outputs/HTML", (err) => {
          if (err) {
            console.log("文件移动报错：", err);
          }
        });

        return res.download(outputFilePath);
      });
    }
  });
});

app.listen(3008, () => {
  console.log("Server listening on port 3008");
});
