const cloud = require('wx-server-sdk')
cloud.init();
exports.main = async (event, context) => {
  const fileList = [];
  const fileID = event.fileID;
  fileList.push(fileID);
  const result = await cloud.getTempFileURL({
    fileList,
  })
  return result.fileList
}