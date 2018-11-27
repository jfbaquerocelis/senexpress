const express = require('express')
const PORT = process.env.PORT || 3000

const app = express()

app.get('/', function (req, res) {
  res.end('Hola mundo!')
})

app.get('/:name', function (req, res) {
  res.end(`Hola ${req.params.name}`)
})

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
