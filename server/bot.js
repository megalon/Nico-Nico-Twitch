const tmi = require('tmi.js')
const WS = require('ws')
const env = require('dotenv').config()

const wss = new WS.Server({ port: 3000 })
const broadcast = data => {
  const payload = JSON.stringify(data)

  for (const ws of wss.clients) {
    if (ws.readyState === WS.OPEN) ws.send(payload)
  }
}

const opts = {
  identity: {
    username: process.env.USERNAME,
    password: process.env.OAUTH
  },
  channels: [process.env.CHANNEL]
}

const userList = []

const client = new tmi.client(opts)

client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

client.connect()

function onMessageHandler(target, context, msg, self) {
  if (self) return

  const text = msg.trim()
  if (text[0] === '!') return undefined

  const username = context['username']
  let nameColor = context.color
  if (nameColor === null) {
    if (
      userList.some(e => {
        if (e.name === username) {
          nameColor = e.color
          return true
        } else return false
      })
    ) {
      console.log(`Color for ${username} found in userlist!`)
    } else {
      nameColor = getRandomColor()
      userList.push({ name: username, color: nameColor })
      console.log(
        `Color not found for ${username}! Adding ${nameColor} to userlist!`
      )
    }
  }

  broadcast({
    color: nameColor,
    text: text,
    context: context
  })
}

function onConnectedHandler(addr, port) {
  console.log(`Connected to ${addr}:${port}`)
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'
  var randColor = '#'
  for (var i = 0; i < 6; i++) {
    randColor += letters[Math.floor(Math.random() * 16)]
  }
  return randColor
}
