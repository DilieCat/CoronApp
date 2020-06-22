const moment = require("moment");
const jwt = require("jwt-simple");

//
// Encode (van username naar token)
//
function encodeToken(userId) {
  const playload = {
    sub: userId,
    exp: moment()
      .add(10, "days")
      .unix(),
    iat: moment().unix()
  };
  return jwt.encode(playload, 'bigtestkey');
}

//
// Decode (van token naar username)
//
function decodeToken(token, cb) {
  try {
    const payload = jwt.decode(token, 'bigtestkey');


    // Check if the token has expired
    if (moment().unix() > payload.exp) {
      cb(new Error("token_has_expired"));
    } else {
      cb(null, payload);
    }
  } catch (err) {
    cb(err, null);
  }
}

module.exports = {
  encodeToken,
  decodeToken
};