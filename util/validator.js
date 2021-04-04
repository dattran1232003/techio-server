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
  isUsernameValid,
  isPasswordValid,
} = require('./validate-rules')

const validateLoginForm = (data) => 
  Success()
    .concat(isPasswordValid(data.password, data.password))
    .concat(isUsernameValid(data.username))
    .map(() => data)

const validateRegisterForm = (data) => 
  Success()
    .concat(isEmailValid(data.email))
    .concat(isPasswordValid(data.password, data.confirmPassword))
    .concat(isUsernameValid(data.username))
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
