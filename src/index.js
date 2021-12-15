const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(express.json())

const users = []

function verifyIfUserExists(request, response, next) {
  const { email } = request.headers

  const user = users.find(user => user.email === email)

  if (!user) {
    return response.status(400).json({ error: 'User not found' })
  }

  request.user = user

  return next()
}

app.post('/login', (request, response) => {
  const { nickname, email, password } = request.body

  const userAlreadyExists = users.some(user => user.email === email)

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'User already exists' })
  }

  users.push({
    email,
    nickname,
    password,
    id: uuidv4()
  })

  return response.status(201).send()
})

app.get('/account', verifyIfUserExists, (request, response) => {
  const { user } = request

  return response.json(user)
})

app.listen(4000)
