const fs = require('fs-extra');
const open = require('open');
const path = require('path');
const inquirer = require('inquirer');
const { removeLastSubpath, getFileExtension, getMatchingSubFile, getFileNameFromPath, getLastSubpath, padFrontZero, capitalize } = require('./utils');

const standardFolderRegex = /^(?<name>[\w\s]+).+(?<year>\(\d+\))(?<tvdbid>\s\[tvdbid=\d+\])?$/;
const episodeTagRegexes = [
  /[sS](?<season>\d+)\s?[eE](?<episode>\d\d+)/,
  /(?<season>\d+)[xX](?<episode>\d+)/,
  /[sS].?(?<season>\d+)\s-\s(?<episode>(\d)+)/,
  /[eE]pisode\s(?<episode>\d+)/,
  /[eE]pisode.?(?<episode>\d+)/,
  /_(?<episode>\d+)_/,
  /(?<episode>\d+)/
]

const seasonFolderNumberRegex = /.*\s(?<season>[\d]+)/;

const getSeriesFolderRenameCfg = async (fileName) => {
  const { name } = await inquirer.prompt(
    [
      {
        type: 'input',
        name: 'name',
        message: `
         Name of the series for ${ fileName }
        `,
      },
    ]
  );
  open(`https://thetvdb.com/search?query=${ name }`);
  const { year } = await inquirer.prompt(
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

  const { tvdbid } = await inquirer.prompt(
    [
      {
        type: 'input',
        name: 'tvdbid',
        message: `
         (optional) tvdbid of the show
        `,
      }
    ]
  );

  return {
    name,
    year,
    tvdbid,
    oldName: fileName,
    newName: `${ capitalize(name) } (${ year })${ tvdbid ? ` [tvdbid=${ tvdbid }]` : '' }`,
  }
}

const renameSeries = async (folderPath) => {
  try {
    const allFiles = fs.readdirSync(folderPath, { withFileTypes: true })
    const folders = allFiles.filter(f => f.isDirectory());
    const files = allFiles.filter(f => !f.isDirectory()).filter(f => !f.name.endsWith('.srt') && !f.name.endsWith('.idx') && !f.name.endsWith('.sub'));
    if (files.length > 0) {
      console.error(`This should be run in the folder container the folder of all your series. Ex: c:\\media\\tv\\. Which would contain c:\\media\\tv\\Sopranos\\Season 1, c:\\media\\tv\\Barry\\Season 2`)
    }

    for (const folder of folders) {
      const matches = folder.name.match(standardFolderRegex)?.groups;
      if (matches && matches.name && matches.year && matches.tvdbid) {
        console.log(`${ folder.name } already up to standard`);
        continue;
      }
      const seasonFolders = fs.readdirSync(path.join(folderPath, folder.name), { withFileTypes: true }).filter(f => f.isDirectory() && f.name.toLocaleLowerCase().includes('season'));
      let episodeFilesPath = [];
      for (const seasonFolder of seasonFolders) {
        const files = fs.readdirSync(path.join(folderPath, folder.name, seasonFolder.name), { withFileTypes: true }).filter(f => !f.isDirectory() && !f.name.includes('.srt') && !f.name.endsWith('.idx') && !f.name.endsWith('.sub'));
        episodeFilesPath = [...episodeFilesPath, ...files.map(f => path.join(folderPath, folder.name, seasonFolder.name, f.name))];
      }

      const renameCfg = await getSeriesFolderRenameCfg(folder.name);

      let episodeRenameCfg = [];
      for (const episodeFilePath of episodeFilesPath) {
        let defaultEpisodeTag = '';
        const fileName = getFileNameFromPath(episodeFilePath);
        const match = episodeTagRegexes.map(r => fileName.match(r)).find(m => !!m);
  
        if (match) {
          const episode = match.groups.episode;
          let season = match.groups.season;
          if (!season || season.length > 2) {
            season = getLastSubpath(removeLastSubpath(episodeFilePath)).match(seasonFolderNumberRegex)?.groups?.season || season;
          }

          defaultEpisodeTag = `S${padFrontZero(season)}E${padFrontZero(episode)}`
        }

        let userRequestEpisodeTag = '';
        let episodeTagMatchesStandard = defaultEpisodeTag.match(episodeTagRegexes[0]) || {};
        if(!episodeTagMatchesStandard.groups?.season || !episodeTagMatchesStandard?.groups?.episode) {
          userRequestEpisodeTag = (await inquirer.prompt(
            [
              {
                type: 'input',
                name: 'episodeTag',
                default: defaultEpisodeTag,
                message: `
                 What is the episode that tag for this episode (ex: S0102, 145, 1x3):
                 ${ episodeFilePath }
                 Hit enter for default: ${defaultEpisodeTag}
                `,
              }
            ]
          )).episodeTag;
        }

        episodeRenameCfg = [...episodeRenameCfg, { oldPath: episodeFilePath, newPath: `${ removeLastSubpath(episodeFilePath) }\\${ capitalize(renameCfg.name) } ${ (userRequestEpisodeTag || defaultEpisodeTag).toUpperCase() }${ getFileExtension(episodeFilePath) }` }];
      }

      const fullOldPath = path.join(folderPath, folder.name);
     
      const fullNewPath =  path.join(folderPath, renameCfg.newName);

      const { confirm } = await inquirer.prompt(
        [
          {
            type: 'input',
            name: 'confirm',
            message: `
             Confirm rename (y/n) (default y):
             folder
             =>${ fullOldPath }
             =>${ fullNewPath }
              episodes
              ${ episodeRenameCfg.map(cfg => `
              -----------------------
              =>${ cfg.oldPath }
              =>${ cfg.newPath }`) }`,
          }
        ]
      );

      if (confirm.toLowerCase() !== 'n') {
        for (const cfg of episodeRenameCfg) {
          fs.renameSync(cfg.oldPath, cfg.newPath);
          ['srt', 'sub', 'idx'].forEach((subFileType) => {
            const oldSubPath = getMatchingSubFile(cfg.oldPath, subFileType);
            const subExists = fs.existsSync(oldSubPath);
            const newSubPath = getMatchingSubFile(cfg.newPath, subFileType);
            if (subExists) {
              fs.renameSync(oldSubPath, newSubPath);
            }
          })
        }
        fs.renameSync(fullOldPath, fullNewPath);
      }
    }


  } catch (error) {
    console.error(error);
  }
}

module.exports = { renameSeries }