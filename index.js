const { Client, GatewayIntentBits, Collection, REST, Routes, Events } = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios")
const express = require("express")
const { buyOrder } = require("./utils/buyOrder.js")
const dhive = require("@hiveio/dhive")
const { ethers } = require("ethers")
require('dotenv').config();


const app = express()
const ready = () => console.log("Server running in port " + 3031)
const httpServer = app.listen(3031, ready)

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

client.commands = new Collection()

client.once("ready", () => {
    let guildId = 0;
    client.guilds.cache.forEach(guild => {
        guildId = guild.id;
        return;
    });

    const commands = []
    const commandFiles = fs.readdirSync("./commands");

    for (const file of commandFiles) {
        if (file.endsWith('.js')) {
            const command = require(`./commands/${file}`);
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST({ version: '9' }).setToken(process.env.login);
    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(process.env.client_id),
                { body: commands }
            );
        } catch (error) {
            console.error(error);
        }
    })();
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        command.execute(interaction).catch(console.error)
    }
})

client.login(process.env.login)

const CONTRACT_ADRESS = "0xe9E6b372a8bB30cf95387E10F66b9cA193416e5b"


async function starproToken() {
    try {

    }
    catch (e) {
        console.log(e)
    }
}

starproToken()

async function addCardsToDB() {
    const filePath = "cards.json"
    let offset = 15418000
    let length = 1000
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let count = 0
    do {
        let result = await axios.post("https://herpc.dtools.dev/contracts", { "jsonrpc": "2.0", "id": 10, "method": "find", "params": { "contract": "nft", "table": "STARinstances", "query": {}, "limit": 1000, "offset": offset, "indexes": ["account"] } })
        offset += 1000
        length = result.data.result.length
        let allCards = result.data.result
        console.log(offset)
        allCards.forEach(cards => {
            let propertiesType = cards.properties.type
            if (!data.hasOwnProperty(propertiesType)) {
                let existingObject = data.find(obj => obj.name === propertiesType);
                if (existingObject) {
                    count++
                    return;
                }
                else {
                    let fans = "0"
                    let luck = "0"
                    let skill = "0"
                    let im = "0"
                    if (cards.properties.stats) {
                        let stats = cards.properties.stats.split(",")
                        fans = stats[0]
                        luck = stats[1]
                        skill = stats[2]
                        im = stats[3]
                    }
                    const newObject = {
                        name: cards.properties.type,
                        class: cards.properties.class,
                        fans: fans,
                        luck: luck,
                        skill: skill,
                        im: im,
                    }
                    data.push(newObject)
                    console.log(data.length, count)
                }
            }
        })
    }
    while (length === 1000)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4))
}

/* async function start() {
    apiKey= "cqt_rQgMJddtFYd7KyX9hyv7rk3ywFXm"
    const poolAddress = "0x02ba675fec5a601d206e65a8d6f23b2fe694a61c"
    const chainId= 137
    const endpoint = `https://api.covalenthq.com/v1/${chainId}/xy=k/uniswap_v3/pools/address/${poolAddress}/transactions/?key=${apiKey}`;
    let response = await axios.get(endpoint)
}

start() */
