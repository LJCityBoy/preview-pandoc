const { exec } = require('child_process');

const inputFile = './uploads/111t.docx'; // 替换为你要转换的输入文件路径
const outputFile = './outputs/output.pdf'; // 替换为你要生成的输出文件路径

// 构建 Unoconv 命令
const unoconvCommand = `unoconv -f pdf -o ${outputFile} ${inputFile}`;

// 执行 Unoconv 命令
exec(unoconvCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`执行 Unoconv 命令时发生错误: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Unoconv 输出错误信息: ${stderr}`);
    return;
  }
  console.log(`文件转换成功，生成的 PDF 文件路径: ${outputFile}`);
});
