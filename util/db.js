const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize( DATABASE_URL, { dialect: 'postgres', logging: false });

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate({ force: true })
    console.log('connected to the database')

    // precisa do force:true para criar as tabelas novas
    await sequelize.sync({ force: true })

    console.log('synced with the database')
  }
   catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }