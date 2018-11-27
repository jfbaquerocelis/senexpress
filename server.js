const Promise = require('bluebird')
const express = require('express')
const Seneca = require('seneca')
const PORT = process.env.PORT || 3000

const app = express()
const seneca = Seneca({
  log: {
    level: 'info',
    short: true
  },
  errhandler: err => {
    console.error({
      name: err.name,
      message: err.message.match(/failed: (.*)/i)[1]
    })
  }
})

seneca.use(function user () {
  this.add('role:user, cmd:get', function (msg, reply) {
    let users = [{ id: 1, name: 'Edward Rich' }, { id: 2, name: 'Oak Forest' }]
    try {
      let user = users.find(_user => { return _user.id === parseInt(msg.id, 10) })

      if (user) {
        reply(null, user)
      } else {
        throw new Error(`Sorry, the user with id ${msg.id} doesn't exist`)
      }
    } catch (error) {
      reply(error, null)
    }
  })
}).ready(function (err) {
  if (err) console.error(err)

  this.listen()
})

app.get('/', function (req, res) {
  res.end('Hola mundo!')
})

app.get('/:name', function (req, res) {
  res.end(`Hola ${req.params.name}`)
})

app.get('/users/:user_id', async function (req, res) {
  let act = Promise.promisify(seneca.act, { context: seneca })

  try {
    let user = await act('role:user, cmd:get', { id: req.params.user_id })

    res.status(200).json(user)
  } catch (error) {
    res.status(404).json({
      name: error.name,
      message: error.message
    })
  }
})


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
