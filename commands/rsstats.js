const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios")
const { consult } = require("../utils/calculator-rising.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("rs-stats")
        .setDescription("Check stats for account(if more than 100k cards it will take a few minutes to analyze all the cards")
        .addStringOption(option =>
            option.setName("account")
                .setDescription("Your account")
                .setRequired(true)
        ),
    execute: async (interaction) => {
        interaction.deferReply();
        let account = interaction.options.getString("account")
        let stats = await axios.get(`https://www.risingstargame.com/playerstats.asp?player=${account}`)
        let found = stats.data[0]
        if (found.error) {
            interaction.editReply("Player does not exist")
        }
        else {
            let rare = []
            if(found.totalnfts > 199999) {
            rare.push( {vehicles: "N/A", instruments: "N/A", people: "N/A", epic: "N/A", legendary: "N/A", rare: "N/A" })
            }
            else {
            let response = await consult(account)
            rare.push(response)
            }
            let starbits = 0
            let starpro = 0
            let axiosStarpro = await axios.post("https://ha.herpc.dtools.dev/contracts", { "jsonrpc": "2.0", "id": 5, "method": "find", "params": { "contract": "tokens", "table": "balances", "query": { "account": account, "symbol": "STARPRO" }, "limit": 1000, "offset": 0, "indexes": [] } })
            let axiosStarbits = await axios.post("https://ha.herpc.dtools.dev/contracts", { "jsonrpc": "2.0", "id": 4, "method": "find", "params": { "contract": "tokens", "table": "balances", "query": { "account": account, "symbol": "STARBITS" }, "limit": 1000, "offset": 0, "indexes": [] } })
            /* ERROR IF BALANCE NOT EXISTS */
            try {
                starbits = axiosStarbits.data.result[0].balance
            }
            catch (e) {
                starbits = "0"
            }
            try {
                starpro = axiosStarpro.data.result[0].balance
            }
            catch (e) {
                starpro = "0"
            }
            let accountProfile = await axios.get(`https://hive.blog/@${account}.json`)
            let image = "https://i.imgur.com/EEd2bot.jpeg"
            if (accountProfile.data.user && accountProfile.data.user.posting_json_metadata) {
                try {
                    let metadata = JSON.parse(accountProfile.data.user.posting_json_metadata)
                    image = metadata.profile.profile_image
                }
                catch (e) {
                    console.log(e)
                }
            }
            const embed = new EmbedBuilder()
                .setColor("#ED760E")
                .setTitle('Rising Star Game Player Statistics')
                .setURL("https://www.risingstargame.com/game.asp")
                .setAuthor({ name: account, iconURL: image, url: `https://hive.blog/@${account}` })
                .setThumbnail('https://i.imgur.com/q6sXnRX.png')
                .addFields(
                    { name: 'Account', value: stats.data[0].name, inline: true },
                    { name: 'Level', value: stats.data[0].level, inline: true },
                    { name: 'Total missions', value: stats.data[0].missions, inline: true },
                    { name: 'STARBITS', value: starbits, inline: true },
                    { name: 'STARPRO', value: starpro, inline: true },
                    { name: 'Total NFT´s', value: stats.data[0].totalnfts, inline: true },
                    { name: 'Number of Fans', value: stats.data[0].cardsfans, inline: true },
                    { name: 'Number of Luck', value: stats.data[0].cardsluck, inline: true },
                    { name: 'Number of Skill', value: stats.data[0].cardskill, inline: true },
                    { name: 'Number of IM', value: stats.data[0].cardsim, inline: true },
                    { name: 'Ego accumulated', value: stats.data[0].missionego, inline: true },
                    { name: 'Lesson Skill accumulated', value: stats.data[0].lessonskill, inline: true },
                    { name: 'Rare cards', value: rare[0].rare, inline: true },
                    { name: 'Epic cards', value: rare[0].epic, inline: true },
                    { name: 'Legendary cards', value: rare[0].legendary, inline: true },
                    { name: 'Instruments', value: rare[0].instruments, inline: true },
                    { name: 'People', value: rare[0].people, inline: true },
                    { name: 'Vehicles', value: rare[0].vehicles, inline: true }
                )
                .setFooter({ text: 'if returning N/A is because calculating with so many cards to calculate(MAX 200k cards)', iconURL: 'https://i.imgur.com/S1LpJ8G.png' });
            interaction.editReply({ embeds: [embed] })
        }
    },
}