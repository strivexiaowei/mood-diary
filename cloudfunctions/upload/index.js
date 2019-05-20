const cloud = require('wx-server-sdk');

exports.main = async (event, context) => {
  return await cloud.uploadFile({
    cloudPath: 'demo.jpg',
    fileContent: fileStream,
  })
}