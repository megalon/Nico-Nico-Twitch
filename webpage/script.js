const wsTwitch = new WebSocket('ws://localhost:3000')

let messagesArray = []
let maxMovementNums = 3
let movementNum = 0

const messagesDiv = document.getElementById('messages')

wsTwitch.onmessage = function(event) {
  const eventData = JSON.parse(event.data)
  const context = eventData.context

  if (eventData.text.startsWith('!')) return

  const fontColor = eventData.color
  const sanitizedText = eventData.text

  buildEmotesInString(context.emotes, sanitizedText)

  const msgDiv = document.createElement('div')
  const nameDiv = document.createElement('div')
  const msgContentDiv = document.createElement('div')

  msgDiv.id = context.messageID
  msgDiv.className += 'message'
  msgDiv.className += ` messageMovement${movementNum}`

  nameDiv.className += 'messageUsername'
  msgContentDiv.className += 'messageContent'

  // Color the username, if the color exists
  if (fontColor !== undefined && fontColor != null) {
    nameDiv.innerHTML = `<font color="${fontColor}">${context['display-name']}</font>`
    msgContentDiv.innerText = `: ${sanitizedText}`
  } else {
    msgContentDiv.innerText = `${context['display-name']}: ${sanitizedText}`
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

function buildEmotesInString(emotesObject, text) {
  let emotes = []

  // Built emotes array
  for (let [key, value] of Object.entries(emotesObject)) {
    for (let v of value) {
      const indexes = v.split('-')
      emotes.push({
        emote: key,
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
  console.log(emotes)

  // Replace text with emote number
  let finalText = '' + text
  console.log(finalText)
  for (emote of emotes) {
    console.log(emote)
    finalText =
      finalText.substring(0, emote.startIndex) +
      emote.emote +
      finalText.substring(emote.endIndex)
  }
  console.log(finalText)
}
