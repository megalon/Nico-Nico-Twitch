const tmi = require('tmi.js')
const WS = require('ws')

const wss = new WS.Server({ port: 3000 })
const broadcast = data => {
  const payload = JSON.stringify(data)

  for (const ws of wss.clients) {
    if (ws.readyState === WS.OPEN) ws.send(payload)
  }
}

const opts = {
  identity: {
    username: 'username',
    password: 'ouath:enter-oauth-here!!!!!!!'
  },
  channels: ['channelname']
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

  const displayName = context['display-name']
  const messageID = context['id']
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
    )
      console.log(`Color for ${username} found in userlist!`)
    else {
      nameColor = getRandomColor()
      userList.push({ name: username, color: nameColor })
      console.log(
        `Color not found for ${username}! Adding ${nameColor} to userlist!`
      )
    }
  }

  broadcast({
    messageID: messageID,
    displayName: displayName,
    color: nameColor,
    text: text
  })
}

function onConnectedHandler(addr, port) {
  console.log(`Connected to ${addr}:${port}`)
}

/*
  Example context

{ 
  badges: { broadcaster: '1', subscriber: '0' },
  color: null,
  'display-name': 'MegalonTTV',
  emotes: null,
  flags: null,
  id: 'b6a1bfa8-6fbc-4533-bba0-f9eaf67d78a5',
  mod: false,
  'room-id': '401283035',
  subscriber: true,
  'tmi-sent-ts': '1551207248515',
  turbo: false,
  'user-id': '401283035',
  'user-type': null,
  'emotes-raw': null,
  'badges-raw': 'broadcaster/1,subscriber/0',
  username: 'megalonttv',
  'message-type': 'chat'
}
*/

function getRandomColor() {
  var letters = '0123456789ABCDEF'
  var randColor = '#'
  for (var i = 0; i < 6; i++) {
    randColor += letters[Math.floor(Math.random() * 16)]
  }
  return randColor
}
