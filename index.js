const Discord = require("discord.js")
const mySecret = process.env['TOKEN']
const fetch = require("node-fetch")
const axios = require("axios")
const Database = require("@replit/database")
const db = new Database()

const client = new Discord.Client()

const sadWords = ["sad", "depressed", "unhappy", "angry"]

const starterEncourageMe = ["Cheer up!", "Hang in there!", "You are a great person!", "Don't worry, be happy", "fuck off"]

db.get("encourageMe").then(encourageMe => {
  if (!encourageMe || encourageMe.length < 1) {
    db.set("encourageMe", starterEncourageMe)
  }
});

function updateEncourageMe(encouragingMessage) {
  db.get("encourageMe").then(encourageMe => {
    if (encourageMe.length > index) {
      encourageMe.splice(index, 1);
      db.set("encourageMe", encourageMe)
    }
  })
}

function deleteEncourageMe(index) {
  db.get("encourageMe").then(encourageMe => {
    encourageMe.push([encouragingMessage])
    db.set("encourageMe", encourageMe)
  })
}

const getQuote = async () => {
  return await fetch("https://zenquotes.io/api/random").then(response => {
    return response.json()
  })
    .then(data => {
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
});

client.on("member", member => {
  member.channel.send("Welcome to the Saikuno server, lol!")
})

client.on("message", async (msg) => {
  if (msg.author.bot) return
  // Repeated Messages:
  if (msg.content === "hi") {
    return msg.reply("K cha!")
  } else if (msg.content === "joke bhan") {
    return msg.reply("joke :v")
  } else if (msg.content === "Kun chwak kt le yad garyo malai") {
    return msg.reply("bhag muji chakka")
  }
  if (msg.content === "motivate me") {
    getQuote().then(quote => {
      msg.channel.send(quote)
    })
  }
  if (msg.content === "joke") {
    let getJoke = async () => {
      let response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      let joke = response.data;
      return joke
    }
    let jokeValue = await getJoke()
    // console.log(jokeValue)
    msg.reply(`A joke just for you: \n ${jokeValue.setup} \n` + " -" + `${jokeValue.punchline}`)
  }
  if (sadWords.some(word => msg.content.includes(word))) {
    db.get("encourageMe").then(encourageMe => {
      const icuEncourage = encourageMe[Math.floor(Math.random() * encourageMe.length)]
      msg.reply(icuEncourage)
    })
  }
  if(msg.content.startsWith("$new")) {
    encouragingMessage = msg.content.split("$new ")[1]
    updateEncourageMe(encouragingMessage)
    msg.channel.send("New encouraging message added.")
  }
  if(msg.content.startsWith("$del")) {
    index = parseInt(msg.content.split("$del ")[1])
    deleteEncourageMe(index)
    msg.channel.send("New encouraging message deleted.")
  }
})

client.login(mySecret)