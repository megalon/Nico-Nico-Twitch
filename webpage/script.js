const wsTwitch = new WebSocket('ws://localhost:3000')
const wordsToFilter = ["cock", "blowjob", "dyke", "fag", "fellate", "jizz", "negres", "negress", "negro", "negroes", "negroid", "negros", "nigars", "nigers", "nigette", "nigettes", "nigga", "niggah", "niggahs", "niggar", "niggaracci", "niggard", "niggarded", "niggarding", "niggardliness", "niggardlinesss", "niggards", "niggars", "niggas", "niggaz", "nigger", "niggerhead", "niggerhole", "niggers", "niggle", "niggled", "niggles", "niggling", "nigglings", "niggor", "niggress", "niggresses", "nigguh", "nigguhs", "niggur", "niggurs", "niglet", "nignog", "nigor", "nigors", "nigr", "nigra", "nigras", "nigre", "nigres", "nigress", "wigga", "wiggas", "wigger", "wiggers", "whigger", "whiggers", "wetback", "wetbacks", "towel head", "towel heads", "towelhead", "trailertrash", "trannie", "tranny", "transvestite", "timber nigger", "timber niggers", "timbernigger", "swamp guinea", "swamp guineas", "tacohead", "tacoheads", ":biggnome", "spunk", "ejaculate", "subscribe to pewdiepie", "sub to pewdiepie", "sub to pewds", "submarine two peyewdeepie", "sup to bewds", "our team is currently working very hard to remove this user from our database", "send this to 10 other discords", "send this to ten other discords", "this is memecat", "this is memedog", "eideipwep ot ebircsbus", "sub to bobbie", "retard", "retarded", "copy and paste him", "we from the steven fanclub stand behin our idolized steven", "we from the steven fanclub stand behind our idolized steven", "steven fanclub", "nigglr", "niggir", "niggre", "unzips dick", "copy and paste this to all", "https://skribbl.io/", "discord by pasting him", "look out for a discord user by the name of"]

let messagesArray = []
let maxMovementNums = 3
let movementNum = 0

const messagesDiv = document.getElementById('messages')

wsTwitch.onmessage = function(event) {
  let eventData = JSON.parse(event.data)

  if (eventData.text.startsWith("!")) return

  const fontColor = eventData.color
  let sanitizedText = eventData.text

  for (word of wordsToFilter) {
    // Remove spaces
    if (sanitizedText.replace(/\s/g, '').includes(word)) {
      console.log(`Detected word ${word}, ignoring message!`)
      return
    }
  }

  const msgDiv = document.createElement("div")
  const nameDiv = document.createElement("div")
  const msgContentDiv = document.createElement("div")

  msgDiv.id = eventData.messageID
  msgDiv.className += "message"
  msgDiv.className += ` messageMovement${movementNum}`

  nameDiv.className += "messageUsername"
  msgContentDiv.className += "messageContent"

  // Color the username, if the color exists
  if (fontColor !== undefined && fontColor != null){
    /*nameDiv.innerHTML = `<font color="${fontColor}">${eventData.displayName}</font>`*/
	  nameDiv.innerHTML = eventData.displayName
	  msgContentDiv.innerText = `: ${sanitizedText}`
	}else {
	  msgContentDiv.innerText = `${eventData.displayName}: ${sanitizedText}`
	}

  msgDiv.style.top = Math.random() * 200

  msgDiv.appendChild(nameDiv)
  msgDiv.appendChild(msgContentDiv)
  messagesDiv.appendChild(msgDiv)

  movementNum = movementNum >= maxMovementNums ? 0 : movementNum + 1

  setTimeout(function(){ document.getElementById(`${msgDiv.id}`).outerHTML = ""; }, 20000);
}