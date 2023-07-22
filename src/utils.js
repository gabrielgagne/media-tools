
const removeLastSubpath = (folderPath) => `${ folderPath.substring(0, folderPath.lastIndexOf(('\\'))) }`;

const getFileNameFromPath = (folderPath) => `${ folderPath.replace(folderPath.substring(0, folderPath.lastIndexOf('\\') + 1), '') }`;

const replaceLastFolderName = (folderPath, newName) => `${ folderPath }\\${ newName }`;

const getMatchingSubFile = (videoFilePath, extension = 'srt') => `${ fileWithoutExtension(videoFilePath) }.${ extension }`;

const fileWithoutExtension = (filePath) => `${ filePath.substring(0, filePath.lastIndexOf(('.'))) }`;

const getFileExtension = (filePath) => `${ filePath.substring(filePath.lastIndexOf('.'), filePath.length) }`;

const getLastSubpath = (folderPath) => {
  let pathToCheck = folderPath;
  if (folderPath.endsWith('\\')) {
    pathToCheck = folderPath.substring(0, folderPath.length - 1);
  }

  return pathToCheck.substring(pathToCheck.lastIndexOf('\\'), pathToCheck.length);
}

const padFrontZero = (numberInString) => {
  const n = Number(numberInString);
  if (Number.isNaN(n) || n === undefined || n === null) {
    console.error(`Sike, that's the wrong number: ${ numberInString }`)
  }

  return n <= 9 ? `0${ n }` : n;
}

const capitalizeFirstLetters = (str) => {
  const arr = str.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

  }
  return arr.join(" ");
}

const capitalize = (str) => {
  return str.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
}

module.exports = {
  removeLastSubpath,
  replaceLastFolderName,
  getMatchingSubFile,
  fileWithoutExtension,
  getFileExtension,
  getFileNameFromPath,
  getLastSubpath,
  padFrontZero,
  capitalizeFirstLetters,
  capitalize
}