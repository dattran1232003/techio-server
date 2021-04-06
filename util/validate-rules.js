const { Success, Failure } = require('folktale/validation')
const { objOf } = require('ramda')

const createError = (fieldName, message) =>([objOf(fieldName, message)])
const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const notEmpty = (field, value='', message) =>
  value?.trim() ?  Success(value)
    : /* else */  Failure(createError(field, message))

const matches = (field, regexp, value='', message = '') =>
  regexp.test(value) ?  Success(value)
    : /* otherwise */   Failure(createError(field, message))

const minLength = (field, min, value, message) =>
  value.length > min ?  Success(value)
    : /* otherwise */   Failure(createError(field, message || 
      `${field} must have ${min} characters.`)
    )

const validURL = (field, url='', message) => 
  url?.match(urlRegex) ? Success(url)
    : /* otherwise */   Failure(createError(field, message
    || `${url} must match with ${field}`))

const equals = (field, value1='', value2='', message) =>
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

const isAvatarValid = avatarURL => Success()
  .concat(notEmpty('avatar', avatarURL, 'đường dẫn avatar không được để trống'))
  .concat(validURL('avatar', avatarURL, 'đường dẫn avatar không hợp lệ'))
  .map(() => avatarURL)

  

module.exports = {
  isEmailValid,
  isAvatarValid,
  isUsernameValid,
  isPasswordValid,
}
