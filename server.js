const express = require('express')
const fs = require('fs')
const secrets = JSON.parse(fs.readFileSync('secret.keys'))
const bot_token = secrets.bot_token
const client_id = secrets.client_id
const client_secret = secrets.client_secret
const Slack = require('slack')
const bot = new Slack({bot_token})
const redirect_uri = "https://0b778865.ngrok.io/auth/redirect"
const request = require('request')
app = express()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()
const port = 7600
app.listen(port)

const numberEmojis = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:']
const pollOptionUserBlock = {
    "type": "context",
    "elements": [
        {
            "type": "mrkdwn",
            "text": " "
        }
    ]
}

app.get('/', (req, res) => {
    res.send("Hello world!")
})

app.post('/event', jsonParser, (req, res) => {
    res.send(req.body.challenge)
})

app.post('/interaction', urlencodedParser, (req, res) => {
    res.status(200).end()
    let payload = JSON.parse(req.body.payload)
    let user = payload.user.id
    let channel = payload.container.channel_id
    let ts = payload.container.message_ts
    let buttonIndex = parseInt(payload.actions[0].value)
    let blocks = payload.message.blocks
    let button = blocks[buttonIndex]
    let buttonUsersBlock = blocks[buttonIndex+1]
    let buttonUsers = buttonUsersBlock.elements[0].text.split(", ")
    buttonUsers = buttonUsers.filter(item => item !== ' ')
    let currUserIndex = buttonUsers.indexOf(`<@${user}|cal>`)
    let buttonText = button.text.text
    let choiceCount = parseInt(buttonText.split("`")[1])
    let updatedButtonText = ""
    if (currUserIndex > -1) {
        updatedButtonText = buttonText.replace(`\`${choiceCount}\``, `\`${choiceCount-1}\``)
        buttonUsers.splice(currUserIndex, 1)
    } else {
        updatedButtonText = buttonText.replace(`\`${choiceCount}\``, `\`${choiceCount+1}\``)
        buttonUsers.push(`<@${user}|cal>`)
    }
    blocks[buttonIndex].text.text = updatedButtonText
    blocks[buttonIndex+1].elements[0].text = buttonUsers.join(', ') === '' ? ' ' : buttonUsers.join(', ')
    bot.chat.update({
        token: bot_token,
        channel: channel,
        text: "",
        ts: ts,
        blocks: blocks
    })
})

app.post('/poll', urlencodedParser, (req, res) => {
    res.status(200).end()
    let response = req.body
    if (response.command !== '/poll') res.end()
    let channel = response.channel_id
    let user = response.user_id
    let values = response.text.split("\"").filter(item => item !== '' && item !== ' ')
    let question = values[0]
    let options = values.slice(1)

    postPoll(channel, user, question, options)
})

app.get('/auth/redirect', (req, res) => {
    var options = {
        uri: `https://slack.com/api/oauth.v2.access?code=${req.query.code}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}`,
        method: 'POST'
    }

    request(options, (error, response, body) => {
        var JSONresponse = JSON.parse(body)
        if (!JSONresponse.ok){
            console.log(JSONresponse)
            res.send("Error encountered: \n"+JSON.stringify(JSONresponse)).status(200).end()
        } else {
            console.log(JSONresponse)
            fs.writeFileSync('./data.json', body)
            res.send("Success!")
        }
    })
})

function postPoll(channel, user, question, options) {
    let blocks = []
    let questionBlock = {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `*${question}* Poll by <@${user}|cal>`
        }
    }
    blocks.push(questionBlock)

    for (let i = 0; i < options.length; i++) {
        let pollOptionBlock = {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": ""
            },
            "accessory": {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": ""
                },
                "value": ""
            }
        }
        pollOptionBlock.text.text = `${numberEmojis[i+1]} ${options[i]}    \`0\``
        pollOptionBlock.accessory.text.text = numberEmojis[i+1]
        pollOptionBlock.accessory.value = `${i+(i+1)}`
        blocks.push(pollOptionBlock)
        blocks.push(pollOptionUserBlock)
    }

    bot.chat.postMessage({
        token: bot_token,
        channel: channel,
        text: "",
        blocks: blocks
    })
}