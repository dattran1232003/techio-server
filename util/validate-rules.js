const { Success, Failure } = require('folktale/validation')
const { objOf } = require('ramda')

const createError = (field, message) =>([objOf(field, message)])
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const notEmpty = (field, value, message) =>
  value.trim() ?  Success(value)
    : /* else */  Failure(createError(field, message))

const matches = (field, regexp, value, message = '') =>
  regexp.test(value) ?  Success(value)
    : /* otherwise */   Failure(createError(field, message))

const minLength = (field, min, value, message) =>
  value.length > min ?  Success(value)
    : /* otherwise */   Failure(createError(field, message || 
      `${field} must have ${min} characters.`)
    )

const equals = (field, value1, value2, message) =>
  value1 === value2 ? Success(value1)
    : /* otherwise */ Failure(createError(field, message))

const isPasswordValid = (password, confirmPassword) => Success()
  .concat(notEmpty('password', password, 'password không được để trống'))
  .concat(minLength('password', 8, password, 'mật khẩu phải có từ 6 ký tự trở lên'))
  .concat(equals('confirmPassword', password, confirmPassword, 'hai mật khẩu phải giống nhau'))
  .map(() => password)

const isUsernameValid = (username) => Success()
  .concat(notEmpty('username', username, 'username không được để trống'))
  .map(() => username)

const isEmailValid = (email) => Success()
  .concat(notEmpty('email', email, 'email không được để trống'))
  .concat(matches('email', emailRegex, email, 'email không hợp lệ'))
  .map(() => email)

module.exports = {
  isEmailValid,
  isUsernameValid,
  isPasswordValid
}
