var connection = require("../../configs/connection");
const bcrypt = require("bcrypt");

exports.signUp = (req, res, next) => {
  let {email, password, nickName, thumbnail, categoryLevel1, categoryLevel2, country, sido, aboutMe, isDesigner} = req.body;
  if (thumbnail == null) {
    thumbnail = null;
  }

  function createHashPw () {
    const p = new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function (err, hash) {
        if (!err) {
          let userData = {
            "email": email,
            "password": hash,
            "nick_name": nickName,
            "is_admin": 0,
            "is_facebook": 0,
            "thumbnail": thumbnail
          };
          resolve(userData);
        } else {
          reject(err);
        }
      });
    });
    return p;
  };

  function createUser (data) {
    const p = new Promise((resolve, reject) => {
      connection.query("INSERT INTO user SET ?", data, (err, rows, fields) => {
        if (!err) {
          let userId = rows.insertId;
          resolve(userId);
        } else {
          reject(err);
        }
      });
    });
    return p;
  };

  function createUserDetail (userId) {
    const p = new Promise((resolve, reject) => {
      let data = {
        "user_id": userId,
        "category_level1": categoryLevel1,
        "category_level2": categoryLevel2,
        "country": country,
        "sido": sido,
        "about_me": aboutMe,
        "is_designer": isDesigner
      }
      connection.query("INSERT INTO user_detail SET ?", data, (err, rows, fields) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
    return p;
  };

  function respond (data) {
    res.status(200).json({
      message: "회원가입을 환영합니다."
    });
  }

  function error (err) {
    res.status(500).json({
      error: err
    });
  };

  isOnlyEmail(email)
  .then(() => {
    return isOnlyNicName(nickName);
  })
  .then(createHashPw)
  .then(createUser)
  .then(createUserDetail)
  .then(respond)
  .catch(error);
};

function isOnlyNicName (name) {
  const p = new Promise((resolve, reject) => {
    connection.query(`SELECT count(nick_name) FROM user WHERE nick_name='${name}'`, (err, rows) => {
      if (!err) {
        if (rows[0]["count(nick_name)"] === 0) {
          resolve(true);
        } else {
          const errorMessage = "중복된 닉네임입니다.";
          reject(errorMessage);
        }
      } else {
        reject(err);
      }
    });
  });
  return p;
};

function isOnlyEmail (email) {
  const p = new Promise((resolve, reject) => {
    connection.query(`SELECT count(email) FROM user WHERE email='${email}'`, (err, rows) => {
      if (!err) {
        if (rows[0]["count(email)"] === 0) {
          resolve(rows);
        } else {
          const errorMessage = "중복된 E-Mail입니다.";
          reject(errorMessage);
        }
      } else {
        reject(err);
      }
    });
  });
  return p;
};
