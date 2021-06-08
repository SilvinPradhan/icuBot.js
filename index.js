const Discord = require("discord.js")
const mySecret = process.env['TOKEN']
const fetch = require("node-fetch")
const axios = require("axios")
const client = new Discord.Client()

const sadWords = ["sad", "depressed", "unhappy", "angry"]
const encourageMe = ["Cheer up!", "Hang in there!", "You are a great person!", "Don't worry, be happy"]

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
  // Repeated Messages:z
  if (msg.content === "hi") {
    return msg.reply("K cha!")
  } else if (msg.content === "joke bhan") {
    return msg.reply("joke :v")
  }
  if (msg.content === "motivate me") {
    getQuote().then(quote => {
      msg.channel.send(quote)
    })
  }
  if (msg.content === "joke") {
    let getJoke = async() => {
      let response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      let joke = response.data;
      return joke
    }
    let jokeValue = await getJoke()
    // console.log(jokeValue)
    msg.reply(`A joke just for you: \n ${jokeValue.setup} \n` + " -" + `${jokeValue.punchline}`)
  }
  if(sadWords.some(word => msg.content.includes(word))) {
    const icuEncourage = encourageMe[Math.floor(Math.random() * encourageMe.length)]
    msg.reply(icuEncourage)
  }
})

client.login(mySecret)