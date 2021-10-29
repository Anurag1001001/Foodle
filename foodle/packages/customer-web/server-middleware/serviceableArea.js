import express from 'express'
const app = express()

const zipCode = ['611 30', '611 31', '611 32', '611 33', '611 34', '611 35', '611 36', '611 37', '611 38', '611 39', '611 44', '611 45', '611 46', '611 48', '611 49', '611 51', '611 52', '611 53', '611 54', '611 55', '611 56', '611 57', '611 58', '611 59', '611 60', '611 60', '611 61', '611 62', '611 63', '611 64', '611 65', '611 66', '611 67', '611 68', '611 69']

app.get('/addBounds', (req, res) => {
  const postalCode = req.query.postal
  for (const code of zipCode) {
    if (code === postalCode) {
      return res.send(true)
    }
  }
  return res.send(false)
})

module.exports = app
