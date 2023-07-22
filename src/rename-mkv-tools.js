const fs = require('fs-extra');
const path = require('path');
const fileExtraRegex = /\s*\(\d+\)\s*/;
const renameMkvTool = async (folderPath) => {
  try {
    const allFiles = fs.readdirSync(folderPath, { withFileTypes: true })
    const files = allFiles.filter(f => !f.isDirectory()).filter(f => !f.name.endsWith('.srt'));
    files.filter(f => f.name.match(fileExtraRegex)).forEach((file) => {
      const newName = file.name.replace(fileExtraRegex, '');
      const existing = files.find(toDelete => toDelete.name === newName);
      const newFileName =  path.join(folderPath, newName);
      const fileToReplaceDeletedFile =  path.join(folderPath, file.name);
      if(existing) {
        fs.unlinkSync(newFileName);
      }
      fs.renameSync(fileToReplaceDeletedFile, newFileName)

   });
} catch (error) {
  console.error(error);
}
}
module.exports = { renameMkvTool }