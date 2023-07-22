#! /usr/bin/env node
const inquirer = require('inquirer');
const { renameMovieFiles } = require('./rename-movies');
const { renameSeries } = require('./rename-series');
const { renameMkvTool } = require('./rename-mkv-tools');
const { cleanMkv } = require('./clean-mkv');
const { renameSequentiallyByIndex } = require('./rename-sequentialy-by-index');
const cfg = require('./cfg.json');

const getFolderPath = async () => {
  const { folderPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'folderPath',
      message: `Input folder path`,
    },
  ]);

  return folderPath;
}
const getTvOrMoviePath = async () => {
  if (cfg.mediaPath) {
    const { type } = await inquirer.prompt({
      type: 'input',
      name: 'type',
      message: `Select task (1 or 2):
        1. Movies (${ cfg.mediaPath }\\movies)
        2. Tv (${ cfg.mediaPath }\\tv)
      `,
    });
    switch (type) {
      case '1':
        return `${ cfg.mediaPath }\\movies`;
      case '2':
        return `${ cfg.mediaPath }\\tv`;
    }
  }
  return getFolderPath();
}

const main = async () => {
  const { type } = await inquirer.prompt({
    type: 'input',
    name: 'type',
    message: `Select task (1 or 2):
      1. Rename media files
      2. Rename sequentially by index in array
      3. Rename 'a (1).mkv' to a.mkv
      4. Clean mkv of unwanted subtitle & audio track 
    `,
  });


  switch (type) {
    case '1':
      try {
        const folderPath = await getTvOrMoviePath();
        const contentType = folderPath.includes('movie') ? '1' : folderPath.includes('tv') ? '2' : undefined;

        if (contentType === '1') {
          await renameMovieFiles(folderPath)
        }
        if (contentType === '2') {
          await renameSeries(folderPath)
        }
      } catch (error) {
        console.error(error);
      }
      break;
    case '2':
      renameSequentiallyByIndex(await getFolderPath());
      break;
    case '3':
      renameMkvTool(await getFolderPath());
      break;
    case '4':
      cleanMkv(await getFolderPath());
      break;
  }
}

module.exports = { main };
