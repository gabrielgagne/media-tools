const renameSequentiallyByDate = async (path) => {
  const allFilesByDate = fs.readdirSync(folderPath, { withFileTypes: true }).map((file) => {
    return {
      file,
      time: fs.statSync(path + '/' + file.name).mtime.getTime()
    };
  })
    .sort(function (a, b) {
      return a.time - b.time;
    });
}
module.exports = { renameSeries }