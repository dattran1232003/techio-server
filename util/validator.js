const { Success } = require('folktale/validation')
const { reduce, assoc } = require('ramda')

const formatValidateErrors = reduce((accum, current) => {
  const key = Object.keys(current)[0]
  const value = Object.values(current)[0] 
  const sameKeyDifferenceValue = [...(accum[key] || []), value]
  return assoc(key, [...sameKeyDifferenceValue], accum)
}, {})

const {
  isEmailValid,
  isAvatarValid,
  isUsernameValid,
  isPasswordValid,
} = require('./validate-rules')

const validateLoginForm = (data) => 
  Success()
    .concat(isPasswordValid(data.password, data.password))
    .concat(isUsernameValid(data.username))
    .concat(isAvatarValid(data.avatarURL))
    .map(() => data)

const validateRegisterForm = (data) => 
  Success()
    .concat(validateLoginForm(data))
    .concat(isEmailValid(data.email))
    .concat(isAvatarValid(data.avatarURL))
    .concat(isPasswordValid(data.password, data.confirmPassword))
    .map(() => data)

exports.validateRegisterInput = data =>
  validateRegisterForm(data)
    .matchWith({
      Success: _ => _,
      Failure: ({ value: errors }) => formatValidateErrors(errors)
    })

exports.validateLoginInput = data =>
  validateLoginForm(data)
    .matchWith({
      Success: _ => _,
      Failure: ({ value: errors }) => formatValidateErrors(errors)
    })
