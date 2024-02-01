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
  //   临时文件路径
  const inputFilePath = `${req.file.path}`;
  //   文件名
  const _names = req.file.originalname.split(".");
  const fileName = _names[_names.length - 2];
  //   输出路径
  const outputFilePath = `./outputs/${fileName}.md`;
  //   给临时文件重新命名，并删除临时文件
  const newFilePath = `./uploads/${fileName}.docx`;
  fs.rename(inputFilePath, newFilePath, (err) => {
    if (err) {
      return res.status(500).end();
    } else {
      const command =
        req.body.command ||
        `pandoc -s ${newFilePath} -t markdown -o ${outputFilePath} --extract-media=./outputs/README`;

      console.log(command);

      //   拿到文件以及文件转换命令，调用pandoc命令进行文件转换工作
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          return res.status(500).end();
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        return res.download(outputFilePath);
      });
    }
  });
});

app.listen(3008, () => {
  console.log("Server listening on port 3008");
});
