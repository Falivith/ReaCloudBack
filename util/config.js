require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.NODE_ENV === 'development' ? process.env.PORT || 8080: process.env.PORT || 3001,
  // SECRET: process.env.SECRET
}


