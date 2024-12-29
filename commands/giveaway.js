const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const hive = require("@hiveio/hive-js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Get a winner of the comments")
        .addStringOption(option =>
            option.setName("link")
                .setDescription("Link of the post to giveaway")
                .setRequired(true)
        ),
    execute: async (interaction) => {
        const link = interaction.options.getString("link")
        const regex = /@([^/]+)\/(.+)/;
        const matches = link.match(regex);
        try {
            if (matches) {
                const usuario = matches[1];
                const permlink = matches[2];
                await hive.api.getContentReplies(usuario, permlink, function (err, result) {
                    if (err || !result || result.length === 0) {
                        return interaction.reply("No comments found or an error occurred.");
                    }

                    let participants = [];
                    let bots = ["indiaunited", "lolzbot", "hug.bot", "hive-112281", "pgm-curator", "steem-plus", "hivegifbot", "germanbot", "curation-cartel", "youarealive", "hivebuzz", "lolz.pgm", "threespeak", "bdvoter.cur", "zottonetoken", "splinterboost", "ecency", "pizzabot", "discovery-it", "risingstargame", "steem-ua", "hk-gifts", "tipu", "poshtoken", "actifit", "hiq.smartbot", "india-leo", "upvoteturtle", "hivebits", "thepimpdistrict", "hiq.smartbot", "terraboost", "meme.bot", "xyz.store", "stemsocial", "bbhbot", "pinmapple", "luvshares"];
                    let participantsUser = "";
                    result.forEach(participant => {
                        let find = bots.find(user => user === participant.author);
                        if (!find) {
                            participants.push({ author: participant.author, comment: participant.body, url: `https://peakd.com${participant.url}`, title: participant.root_title });
                            participantsUser += `@${participant.author}, `;
                        }
                    });

                    if (participants.length === 0) {
                        return interaction.reply("No valid participants found.");
                    }

                    let numberParticipants = participants.length;
                    let random = Math.floor((Math.random() * numberParticipants));
                    let winner = participants[random];
                    let comment = winner.comment ? winner.comment.slice(0, 120) : "No comment available.";
                    let image = "https://i.imgur.com/EEd2bot.jpeg"; // Default image

                    // Attempt to fetch profile image, fallback to default if unsuccessful
                    hive.api.callAsync('condenser_api.get_accounts', [[winner.author]])
                        .then((res) => {
                            if (res && res[0]?.posting_json_metadata) {
                                try {
                                    let profile = JSON.parse(res[0].posting_json_metadata);
                                    image = profile?.profile?.profile_image || image;
                                } catch (e) {
                                    console.error("Error parsing profile metadata:", e);
                                }
                            }
                        })
                        .catch(err => {
                            console.error("Error fetching account data:", err);
                        })
                        .finally(() => {
                            // Always continue with the giveaway
                            const embed = new EmbedBuilder()
                                .setColor("#FF0000")
                                .setTitle(winner.title || "Unknown Title")
                                .setURL(winner.url)
                                .setAuthor({ name: "devilbot", iconURL: "https://i.imgur.com/S1LpJ8G.png", url: 'https://discord.js.org' })
                                .setDescription(`# **The winner of this giveaway is**:
#  ${winner.author}`)
                                .setThumbnail(image)
                                .addFields(
                                    { name: "Description:", value: comment.replace(/\n/g, ' ') },
                                    { name: "All participants:", value: participantsUser },
                                )
                                .setTimestamp()
                                .setFooter({ text: 'devilbot includes rs-stats, giveaways, get post info and more', iconURL: 'https://i.imgur.com/S1LpJ8G.png' });

                            interaction.reply({ embeds: [embed] });
                        });
                });
            } else {
                interaction.reply("Invalid link");
            }
        } catch (e) {
            console.error("Unexpected error:", e);
            interaction.reply("An unexpected error occurred.");
        }
    },
}
