const inquirer = require('inquirer');
const child_process = require('child_process');
const launchSimpleCommandSync = (commandString) => child_process.spawnSync(commandString, [], {
  shell: true,
  stdio: [process.stdin, process.stdout, process.stderr],
});


const getYoutubeUrl = async () => {
  const { YoutubeUrl } = await inquirer.prompt([
    {
      type: 'input',
      name: 'YoutubeUrl',
      message: `Input url`,
    },
  ]);

  return YoutubeUrl;
}

const youtubeDl = async () => {
  const url = await getYoutubeUrl();
  const cmd = `yt-dlp ${ url } --merge-output-format mp4/mkv"`;
  try {

    const { status } = launchSimpleCommandSync(cmd);
    console.log('process exited with status: ', status);
  } catch {
    console.error(error);
  }
}

module.exports = {
  youtubeDl,
}