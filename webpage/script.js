const wsTwitch = new WebSocket('ws://localhost:3000')

let messagesArray = []
let maxMovementNums = 3
let movementNum = 0

const messagesDiv = document.getElementById('messages')

wsTwitch.onmessage = function(event) {
  const eventData = JSON.parse(event.data)
  const context = eventData.context
  const fontColor = eventData.color
  let text = eventData.text

  // Ignore command messages
  if (eventData.text.startsWith('!')) return

  // Ignore messages that contain any possible HTML tags
  const regex = /<.*>/g
  if (text.search(regex) >= 0) return

  const msgDiv = document.createElement('div')
  const nameDiv = document.createElement('div')
  const msgContentDiv = document.createElement('div')

  msgDiv.id = context.messageID
  msgDiv.className += 'message'
  msgDiv.className += ` messageMovement${movementNum}`

  nameDiv.className += 'messageUsername'
  msgContentDiv.className += 'messageContent'

  // Add emote images to message, if emotes exist
  if (context.emotes !== null) {
    text = insertEmotesIntoMessage(context.emotes, text)
  }

  // Color the username, if the color exists
  if (fontColor !== undefined && fontColor != null) {
    nameDiv.innerHTML = `<font color="${fontColor}">${context['display-name']}</font>`
    msgContentDiv.innerHTML = `: ${text}`
  } else {
    msgContentDiv.innerHTML = `${context['display-name']}: ${text}`
  }

  msgDiv.style.top = Math.random() * 200

  msgDiv.appendChild(nameDiv)
  msgDiv.appendChild(msgContentDiv)
  messagesDiv.appendChild(msgDiv)

  movementNum = movementNum >= maxMovementNums ? 0 : movementNum + 1

  setTimeout(function() {
    document.getElementById(`${msgDiv.id}`).outerHTML = ''
  }, 20000)
}

function insertEmotesIntoMessage(emotesObject, text) {
  let emotes = []

  // Extract all emotes from emotes object,
  // and store their information
  for (let [key, value] of Object.entries(emotesObject)) {
    for (let v of value) {
      const indexes = v.split('-')
      emotes.push({
        emote: key,
        url: `https://static-cdn.jtvnw.net/emoticons/v1/${key}/1.0`,
        startIndex: parseInt(indexes[0]),
        endIndex: parseInt(indexes[1])
      })
    }
  }

  // Sort emotes from last to first
  emotes.sort((a, b) => {
    if (a.startIndex > b.startIndex) {
      return -1
    }
    if (a.startIndex < b.startIndex) {
      return 1
    }
    return 0
  })

  // Loop through the emotes and insert the images from back to front in the message string
  let textAndEmotes = '' + text
  for (emote of emotes) {
    textAndEmotes =
      textAndEmotes.substring(0, emote.startIndex) +
      `<span><img src=${emote.url}></img></span>` +
      textAndEmotes.substring(emote.endIndex + 1)
  }

  return textAndEmotes
}
