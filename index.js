const { Client, GatewayIntentBits, Collection, REST, Routes, Events } = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios")
const express = require("express")
const { buyOrder } = require("./utils/buyOrder.js")
const dhive = require("@hiveio/dhive")
require('dotenv').config();


const app = express()
const ready = () => console.log("Server running in port " + process.env.PORT)
const httpServer = app.listen(process.env.PORT, ready)

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


const filePath = "cards.json"


async function addCardsToDB() {
    let offset = 0
    let length = 1000
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let count = 0
    do {
        let result = await axios.post("https://ha.herpc.dtools.dev/contracts", { "jsonrpc": "2.0", "id": 10, "method": "find", "params": { "contract": "nft", "table": "STARinstances", "query": {}, "limit": 1000, "offset": offset } })
        offset += 1000
        console.log(offset)
        length = result.data.result.length
        let allCards = result.data.result
        allCards.map(cards => {
            let propertiesType = cards.properties.type.toString()
                let existingObject = data.find(obj => obj.name === propertiesType);
                if (existingObject) {
                    count++
                    return;
                }
                else {
                    let fans = "0", luck = "0", skill = "0", im = "0";
                    if (cards.properties.stats) {
                        [fans, luck, skill, im] = cards.properties.stats.split(",");
                    }
                    const newObject = {
                        name: propertiesType,
                        class: cards.properties.class,
                        fans: fans || "0",
                        luck: luck || "0",
                        skill: skill || "0",
                        im: im || "0",
                    }
                    console.log(newObject)
                    data.push(newObject)
                }
            }
        )
    }
    while (length === 1000)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4))
}

addCardsToDB() 

let dclient = new dhive.Client("https://api.hive.blog")
let stream;


async function main() {
    try {
        stream = dclient.blockchain.getBlockStream();
        stream.on("data", async function (block) {
            let transactions = block.transactions;
            for (let transaction of transactions) {
                for (let operation of transaction.operations) {
                    if (operation[1].id === "ssc-mainnet-hive") {
                        let json = JSON.parse(operation[1].json);
                        if(json.length >= 1) {
                            json = json[0]
                        }
                        if (json.contractName === "nftmarket" && json.contractAction === "sell" && json.contractPayload.symbol === "STAR"  ) {
                            let nfts = json.contractPayload.nfts;
                            await rsFans(nfts);
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.log("Error en main:", e);
    }
}

main()




let cards = JSON.parse(fs.readFileSync("cards.json", 'utf8'));
const cardsMap = new Map(cards.map(card => [card.name, card]));
const channelId = "1234316215384801300";

async function rsFans(nfts) {
    try {
        nfts.map(async (nft) => {
            const response = await axios.post("https://custr.ryamer.com/contracts", {
                "jsonrpc": "2.0",
                "id": 13,
                "method": "find",
                "params": {
                    "contract": "nftmarket",
                    "table": "STARsellBook",
                    "query": {
                        "priceSymbol": "STARBITS",
                        "nftId": nft.toString()
                    },
                    "indexes": []
                }
            })
            let result = response.data.result[0]
            let checkCard = cardsMap.get(result.grouping.type)
            if(checkCard.class === "people" && parseFloat(checkCard.fans) >= 5 || checkCard.class === "transport" && parseFloat(checkCard.fans) >= 5 ) {
                let price = parseFloat(result.price)
                let fans = parseFloat(checkCard.fans)
                let skill = parseFloat(checkCards.skill)
                let operation = price / fans
                if(checkCard.class === "transport" && operation < 47.5) {
                                await buyOrder(nft.toString(), result.price);
                                const channel = await client.channels.fetch(channelId)
                                channel.send(`<@429834106310885386> Card found: ${checkCard.name} - Per fan: ${operation} - Fans ${checkCard.fans} - Price: ${result.price}`) 
                }
                else if(checkCard.class === "people" && operation < 52) {
                    await buyOrder(nft.toString(), result.price);
                    const channel = await client.channels.fetch(channelId)
                    channel.send(`<@429834106310885386> Card found: ${checkCard.name} - Per fan: ${operation} - Fans ${checkCard.fans} - Price: ${result.price}`) 
                } 
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}

