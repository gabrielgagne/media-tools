const fs = require('fs-extra');
const open = require('open');
const path = require('path');
const inquirer = require('inquirer');
const fileExtensionRegex = /(?:\.([^.]+))?$/;
const standardFileRegex = /^(?<name>[\w\s]+).+(?<year>\(\d+\))(?<tmdbid>\s\[tmdbid=\d+\])?.*(?<extension>\.([^.]+))$/;
const { replaceLastFolderName, getMatchingSubFile, fileWithoutExtension, removeLastSubpath } = require('./utils');


const getMovieFileRenameCfg = async (fileName) => {
  const { name } = await inquirer.prompt(
    [
      {
        type: 'input',
        name: 'name',
        message: `
         Name of the movie for ${ fileName }
        `,
      },
    ]
  );
  open(`https://www.themoviedb.org/search/movie?query=${ name }`);
  const {  year } = await inquirer.prompt(
    [
      {
        type: 'input',
        name: 'year',
        message: `
         Year of  ${ fileName }'s release
        `,
      },
    ]
  );
  const { tmdbid } = await inquirer.prompt(
    [
      {
        type: 'input',
        name: 'tmdbid',
        message: `
         (optional) tmdbid of the movie
        `,
      }
    ]
  );
  const capitalizedName = name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  const ext = fileExtensionRegex.exec(fileName)[1];
  return {
    name,
    year,
    tmdbid,
    oldName: fileName,
    newName: `${ capitalizedName } (${ year })${ tmdbid ? ` [tmdbid=${ tmdbid }]` : '' }.${ ext }`,
  }
}

const renameMovieFiles = async (folderPath, renameParent = false) => {
  try {
    const allFiles = fs.readdirSync(folderPath, { withFileTypes: true })
    const folders = allFiles.filter(f => f.isDirectory());
    const files = allFiles.filter(f => !f.isDirectory()).filter(f => !f.name.endsWith('.srt'));

    for (const file of files) {
      const matches = file.name.match(standardFileRegex)?.groups;
      if (matches && matches.name && matches.year && matches.tmdbid) {
        console.log(`${ file.name } already up to standard`);
        continue;
      }
      const renameCfg = await getMovieFileRenameCfg(file.name);
      const fullOldPath = path.join(folderPath, renameCfg.oldName);
      const fullNewPath = path.join(folderPath, renameCfg.newName);
      const oldSubPath = getMatchingSubFile(fullOldPath);
      const subExists = fs.existsSync(oldSubPath);
      const newSubPath = getMatchingSubFile(fullNewPath);
      const newFolderPath = renameParent ? replaceLastFolderName(removeLastSubpath(folderPath), fileWithoutExtension(renameCfg.newName)) : '';

      const { confirm } = await inquirer.prompt(
        [
          {
            type: 'input',
            name: 'confirm',
            message: `
             Confirm rename (y/n) (default y):
             File
             =>${ fullOldPath }
             =>${ fullNewPath }
             ${ subExists ? `
              Sub
              =>${ oldSubPath }
              =>${ newSubPath }` : ``
              }
             ${ renameParent ? `
              folder
              =>${ folderPath }
              =>${ newFolderPath }` : ``
              }
            `,
          }
        ]
      );

      if (confirm.toLowerCase() !== 'n') {
        console.log(fullOldPath);
        console.log('------------------------');
        console.log(fullNewPath);
        console.log('------------------------');
        fs.renameSync(fullOldPath, fullNewPath);

        if (subExists) {
          fs.renameSync(oldSubPath, newSubPath);
        }

        if (renameParent) {
          fs.renameSync(folderPath, newFolderPath);
        }
      }
    }

    for (const folder of folders) {
      await renameMovieFiles(path.join(folderPath, folder.name), true)
    }


  } catch (error) {
    console.error(error);
  }
}

module.exports = { renameMovieFiles }