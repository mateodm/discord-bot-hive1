/* const OpenAI = require("openai")
const config = require("../config.json")

async function questionToIA(question) {
    const openai = new OpenAI({
        apiKey: config.apiKey
    });
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: `${question}`  }],
        model: 'gpt-3.5',
    });
    return chatCompletion.choices[0].messages.content;
}

module.exports = {questionToIA} */