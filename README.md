# niconico Twitch chat display

Displays twitch chat in a browser window scrolling across the screen similar to how niconico chat does.

There are two parts to this:
1. Twitch IRC bot that connects to twitch and reads messages, then sends them over a websocket to the webpage.
2. Webpage that displays the messages in the niconico side scrolling format

# Instructions
Install Node if you don't have it already: https://nodejs.org/en/

Install the node `serve` package if you don't already have it: `npm i -g serve` 

## Twitch bot (server)
1. Open the `server\bot.js` file and fill out the username, channel name, and oauth, then save the file.
2. In the server folder, open a commandline window and run `npm install`
3. Then run `node .\bot.js`

The bot will tell you if it connects to twitch.

## Web page
1. Navigate to the `webpage` folder and open a commandline window there
2. Run the command `node serve` 

The server should give you a URL (probably `http://localhost:5000`) that you can connect to in a browser, or OBS browser plugin.

To test it, simply send some messages in your twitch chat and watch the webpage at that URL!
