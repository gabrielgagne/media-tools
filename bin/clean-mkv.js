const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const copyPrefix = 'tmp_ffmpeg_';

const child_process = require('child_process');
const launchSimpleCommandSync = (commandString) => child_process.spawnSync(commandString, [], {
  shell: true,
  stdio: [process.stdin, process.stdout, process.stderr],
});


const cleanMkv = async (folderPath) => {
  try {
    const allFiles = fs.readdirSync(folderPath, { withFileTypes: true })
    const files = allFiles.filter(f => !f.isDirectory()).filter(f => f.name.endsWith('.mkv'));
    const { audio, subtitle, testRun } = await inquirer.prompt(
      [
        {
          type: 'input',
          name: 'audio',
          default: '',
          message: `
            audio track (optional)
          `,
        },
        {
          type: 'input',
          name: 'subtitle',
          message: `
          subtitle track
          `,
        },
        {
          type: 'input',
          name: 'testRun',
          default: 'y',
          message: `
          test run (y/n)
          `,
        }
      ]
    );
    for(const file of files) {
      const filePath = path.join(folderPath, file.name);
      const tmpFilePath = path.join(folderPath, copyPrefix+file.name);
      const cmd = `ffmpeg -i "${filePath}" -map 0:v -map 0:a${audio ? `:${Number(audio)}` : ''} -map 0:s:${subtitle} -c copy "${tmpFilePath}"`;
      const { status } = launchSimpleCommandSync(cmd);
      if(testRun === 'y') {
        process.exit(0);
      } else if (status !== 0) {
        continue;
      } else {
        fs.unlinkSync(filePath);
        fs.renameSync(tmpFilePath, filePath);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
module.exports = { cleanMkv }