const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const hive = require("@hiveio/hive-js")
const axios = require("axios")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("history")
        .setDescription("Get last 7´s transactions")
        .addStringOption(option =>
            option.setName("user")
                .setDescription("user")
                .setRequired(true)
        )
		.addStringOption(option =>
            option.setName("token")
                .setDescription("token in UPPERCASE(if not exists return all tokens history)")
                .setRequired(false)
        ),
    execute: async (interaction) => {
        let user = interaction.options.getString("user").toString()
        let token = ""
        try {
            token = interaction.options.getString("token").toString() || ""
        }
        catch(e) {
            token = ""
        }
        let link = `https://accounts.hive-engine.com/accountHistory?account=${user}&limit=10&offset=0&symbol=${token}`
        let response = await axios.get(`https://accounts.hive-engine.com/accountHistory?account=${user}&limit=10&offset=0&symbol=${token}`)
        let data = response.data
        if(data.length > 1) {
        	const embed = new EmbedBuilder()
        	.setColor("#FF0000")
        	.setTitle("Summary of your last seven transactions")
        	.addFields(
            	{ name: 'From', value: `${data[0].from}`, inline: true },
            	{ name: 'To', value: `${data[0].to}`, inline: true },
            	{ name: 'Amount and Operation', value: `${data[0].quantity} ${data[0].symbol} - ${data[0].operation}`, inline: true} ,
        	)
        	.addFields(
            	{ name: 'From', value: `${data[1].from}`, inline: true },
            	{ name: 'To', value: `${data[1].to}`, inline: true },
            	{ name: 'Amount and Operation', value: `${data[1].quantity} ${data[1].symbol} - ${data[1].operation}`, inline: true },
        	)
        	.addFields(
            	{ name: 'From', value: `${data[2].from}`, inline: true },
            	{ name: 'To', value: `${data[2].to}`, inline: true },
            	{ name: 'Amount and Operation', value: `${data[2].quantity} ${data[2].symbol} - ${data[2].operation}`, inline: true },
        	)
        	.addFields(
            	{ name: 'From', value: `${data[3].from}`, inline: true },
            	{ name: 'To', value: `${data[3].to}`, inline: true },
            	{ name: 'Amount and Operation', value: `${data[3].quantity} ${data[3].symbol}  - ${data[3].operation}`, inline: true },
        	)
        	.addFields(
            	{ name: 'From', value: `${data[4].from}`, inline: true },
            	{ name: 'To', value: `${data[4].to}`, inline: true },
            	{ name: 'Amount and Operation', value: `${data[4].quantity} ${data[4].symbol}  - ${data[4].operation}`, inline: true },
        	)
        	.addFields(
            	{ name: 'From', value: `${data[5].from}`, inline: true },
            	{ name: 'To', value: `${data[5].to}`, inline: true },
            	{ name: 'Amount and Operation', value: `${data[5].quantity} ${data[5].symbol}  - ${data[5].operation}`, inline: true },
        	)
        	.addFields(
            	{ name: 'From', value: `${data[6].from}`, inline: true },
           		{ name: 'To', value: `${data[6].to}`, inline: true },
            	{ name: 'Amount and Operation', value: `${data[6].quantity} ${data[6].symbol}  - ${data[6].operation}`, inline: true },
        	)
        	.setTimestamp()
        	.setFooter({ text: 'devilbot includes rs-stats, giveaways, get post info and more', iconURL: 'https://i.imgur.com/S1LpJ8G.png' });

    	interaction.reply({ embeds: [embed] });
    }
    else {
        interaction.reply("This account not exists or a error ocurred")
    }
    },
}

