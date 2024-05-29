

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const hive = require("@hiveio/hive-js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("An overview of all commands"),
    execute: async (interaction) => {
        const body = "```\n" +
            "/history {account} OPTIONAL:{token}\n" +
            "You can consult the last 7 transactions of an account. If you enter a token, it shows the last 5 transactions with that token. Token must be in UPPERCASE.\n\n" +
            "/rstats {account}\n" +
            "You can consult the statistics of a Rising Star Game Account, including Fans, Luck, Skill, IM, LEVEL, LEGENDARYS, EPIC, EGO, etc.\n\n" +
            "/giveaway {link of post}\n" +
            "You can randomly select a winner for a giveaway made in a post on Hive.\n\n" +
            "/getuserpost {account}, OPTIONAL: {numberPost}\n" +
            "You can retrieve a post from the indicated user, including information such as money received, payday, etc. The numberPost starts from 0 (which is the last post), 1 (the last post and following).\n\n" +
            "/getbalance {account}, OPTIONAL: {token}\n" +
            "You get a list of your balances for the most important HIVE tokens. If you indicate a specific token, you only receive the balance of that token. The token must be in capital letters.\n" +
            "```";
        interaction.reply(body);
    },

}