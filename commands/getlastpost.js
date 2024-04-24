
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const hive = require("@hiveio/hive-js")
const { formatDate } = require("../utils/formatDate.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("getuserpost")
        .setDescription("Get last post information")
        .addStringOption(option =>
            option.setName("user")
                .setDescription("User to consult")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("numberpost")
                .setDescription("0 is LAST POST, 1 is LAST BUT ONE. DEFAULT(0) AND MAX IS 5")
                .setRequired(false)
        ),
    execute: async (interaction) => {
        let account = interaction.options.getString("user").toString()
        let numberPost = interaction.options.getString("numberpost") || 0
        let maxPost = Number(numberPost) + 1
        if (Number(numberPost) <= 4) {
            await hive.api.getBlog(account, 0, maxPost, function (err, data) {
                let check = data[0]
                if (!check || check === "{") {
                    interaction.reply(`User not founded: ${account}`)
                }
                else {
                    let postToGet = data.length - 1
                    let postData = data[postToGet].comment;
                    let metadata = JSON.parse(postData.json_metadata);
                    let image = metadata.image[0];
                    let beneficiaries = (postData.beneficiaries && postData.beneficiaries[0] && postData.beneficiaries[0].account) || "none";
                    let percent = (postData.beneficiaries && postData.beneficiaries[0] && postData.beneficiaries[0].weight && postData.beneficiaries[0].weight.toString().slice(0, -2)) || "100";
                    let pending = Number(postData.pending_payout_value.slice(0, -3));
                    let toReceive = pending / 2;
                    let created = formatDate(postData.created)
                    let payday = formatDate(postData.cashout_time)

                    const embed = new EmbedBuilder()
                        .setColor("#FF0000")
                        .setTitle(postData.title)
                        .setURL(`https://peakd.com${postData.url}`)
                        .setAuthor({ name: postData.author, iconURL: 'https://i.imgur.com/S1LpJ8G.png', url: 'https://discord.js.org' })
                        .addFields(
                            { name: 'Created in', value: created, inline: true },
                            { name: 'Curation reward', value: postData.pending_payout_value, inline: true },
                            { name: 'Payday', value: payday, inline: true }
                        )
                        .addFields(
                            { name: 'Beneficiaries', value: beneficiaries, inline: true },
                            { name: 'Percent', value: `${percent}%`, inline: true },
                            { name: 'To receive', value: `${toReceive}$ USD in HBD/HP`, inline: true }
                        )
                        .setImage(image)
                        .setTimestamp()
                        .setFooter({ text: 'devilbot includes rs-stats, giveaways, get post info and more', iconURL: 'https://i.imgur.com/S1LpJ8G.png' });

                    interaction.reply({ embeds: [embed] });

                }
            })
        }
        else { 
            interaction.reply("Only you can get last 5 posts")
        }
    },
}