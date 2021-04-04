const { Count } = require('../../models')

module.exports = {
  Query: {
    async getTotal(_, { model }) {
      const total = await Count.findOne({ model })
      return total._doc || new Error('Cannot get total pages')
    }
  }
}
