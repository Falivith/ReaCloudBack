const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize( DATABASE_URL, { dialect: 'postgres', logging: true });

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')

    await sequelize.sync()

    console.log('synced with the database')
  }
   catch (err) {
    console.log(err);
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }