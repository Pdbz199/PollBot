const fs = require('fs')
const secrets = JSON.parse(fs.readFileSync('./secret.keys'))
const bot_token = secrets.bot_token
const channel = secrets.channel
const Slack = require('slack')
const bot = new Slack({bot_token})
const WebSocket = require('ws')

// bot.chat.postMessage({
//     token: bot_token,
//     channel: channel,
//     text: "New poll from @Preston Rozwood",
//     attachments: [
//         {
//             "text": "question",
//             "fallback": "You are unable to choose an option",
//             "callback_id": "poll",
//             "color": "#3AA3E3",
//             "attachment_type": "default",
//             "actions": [
//                 {
//                     "name": "option",
//                     "text": "Chess",
//                     "type": "button",
//                     "value": "chess"
//                 },
//                 {
//                     "name": "option",
//                     "text": "Falken's Maze",
//                     "type": "button",
//                     "value": "maze"
//                 },
//                 {
//                     "name": "option",
//                     "text": "Thermonuclear War",
//                     "style": "danger",
//                     "type": "button",
//                     "value": "war"
//                 }
//             ]
//         }
//     ]
// })

bot.chat.postMessage({
	token: bot_token,
	channel: channel,
    text: "",
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Where should we order lunch from?* Poll by @<fakeLink.toUser.com|Preston Rozwood>"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":one: Ace Wasabi Rock-n-Roll Sushi Bar    `0`"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"emoji": true,
					"text": ":one:"
				},
				"value": "1"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": " "
				}
			]
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":two: Super Hungryman Hamburgers    `0`"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"emoji": true,
					"text": ":two:"
				},
				"value": "3"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": " "
				}
			]
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":three: Kagawa-Ya Udon Noodle Shop    `0`"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"emoji": true,
					"text": ":three:"
				},
				"value": "5"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": " "
				}
			]
		}
	]
})