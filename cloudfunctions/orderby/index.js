const cloud = require('wx-server-sdk');
cloud.init({
  env: 'tes-076d73'
})
const db = cloud.database()
exports.main = async (event, context) => {
  let { limit, skip } = event;
  return await db.collection('mood').orderBy('createTime', 'desc').limit(limit).skip(skip).get();
}