const wsTwitch = new WebSocket('ws://localhost:3000')

let messagesArray = []
let maxMovementNums = 3
let movementNum = 0

const messagesDiv = document.getElementById('messages')

wsTwitch.onmessage = function(event) {
  let eventData = JSON.parse(event.data)

  if (eventData.text.startsWith('!')) return

  const fontColor = eventData.color
  const sanitizedText = eventData.text

  const msgDiv = document.createElement('div')
  const nameDiv = document.createElement('div')
  const msgContentDiv = document.createElement('div')

  msgDiv.id = eventData.messageID
  msgDiv.className += 'message'
  msgDiv.className += ` messageMovement${movementNum}`

  nameDiv.className += 'messageUsername'
  msgContentDiv.className += 'messageContent'

  // Color the username, if the color exists
  if (fontColor !== undefined && fontColor != null) {
    nameDiv.innerHTML = `<font color="${fontColor}">${eventData.displayName}</font>`
    msgContentDiv.innerText = `: ${sanitizedText}`
  } else {
    msgContentDiv.innerText = `${eventData.displayName}: ${sanitizedText}`
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
