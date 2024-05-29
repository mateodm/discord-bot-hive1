const { Client, GatewayIntentBits, Collection, REST, Routes, Events } = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios")
const express = require("express")
const { buyOrder } = require("./utils/buyOrder.js")
const dhive = require("@hiveio/dhive")
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

