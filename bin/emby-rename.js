#! /usr/bin/env node
const inquirer = require('inquirer');
const { renameMovieFiles } = require('./rename-movies');
const { renameSeries } = require('./rename-series');
const { renameMkvTool } = require('./rename-mkv-tools');
const { cleanMkv } = require('./clean-mkv');

(async () => {
  const { type } = await inquirer.prompt({
    type: 'input',
    name: 'type',
    message: `Select task (1 or 2):
      1. Rename media files
      2. Rename sequentially by date
      3. Rename 'a (1).mkv' to a.mkv
      4. Clean mkv of unwanted subtitle & audio track 
    `,
  });
  const { folderPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'folderPath',
      message: `Input folder path`,
    },
  ]);

  switch (type) {
    case '1':
      try {
        let contentType = folderPath.includes('movie') ? '1' : folderPath.includes('tv') ? '2' : undefined;
        if (!contentType) {
          contentType = await inquirer.prompt([
            {
              type: 'input',
              name: 'askContentType',
              message: `Movies (1) or TV (2)`,
            }
          ]).askContentType;
        }

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
      renameSequentiallyByDate(folderPath);
      break;
    case '3':
      renameMkvTool(folderPath);
      break;
    case '4':
      cleanMkv(folderPath);
      break;
  }
})()

