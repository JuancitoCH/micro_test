
const response = require("express").response;
const { jwt_secret, mode } = require("../config/envs.js");
const jwt = require("jsonwebtoken");

const errorResponse = (res, error, status = 500) => {

  if (error.hasOwnProperty("code") || error.hasOwnProperty("errors")) {
    if (error.code === 11000) {
      console.log('aa')
      return res.status(400).json({
        success: false,
        errors: { 
          message: Object.keys(error.keyValue).map((field) => {
            return `The ${field} ${error.keyValue[field]} is already in use`
          })}
      })
    }

    return res.status(400).json({
      success: false,
      errors: { 
        message: 
        Object.values(error.errors).map(({ message }) => {
          return message
        })
        // Object.keys(error.errors).forEach((key) => {
        //   errors[key] = error.errors[key].message;
        // })
    },
    });
  }
  console.log("asad")
  return res.status(status).json({
    success: false,
    errors: { message: [error.message] || error },
  });
};

const authResponse = async (
  res = response,
  status,
  success,
  message,
  data,
) => {
  const { user, token } = data;
  let exp;
  try {
    exp = jwt.verify(token, jwt_secret).exp;
  } catch (error) {
    return errorResponse(res, error, 500);
  }
  return res
        .status(status)
        .cookie("token", token, {
          httpOnly: true,
          // comprobamos el modo de el server ( dev )
        ...(mode!=='dev')&&( {secure:true, sameSite:'none'} ),
          expires: new Date(exp * 1000),
        })
        .json({ success, message, user });
};

const successfulResponse = (
  res = response,
  status,
  success,
  message,
  data = null
) => {
  return data
    ? res.status(status).json({
        success,
        message,
        data,
      })
    : res.status(status).json({
        success,
        message,
      });
};

const logoutResponse = (res = response) => {
  return res.clearCookie("token").status(200).json({
    success: true,
    message: "Session was successfully closed",
  });
};

module.exports = { errorResponse, authResponse, successfulResponse, logoutResponse };
