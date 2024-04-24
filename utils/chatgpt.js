/* const { SlashCommandBuilder } = require("discord.js");
const {questionToIA} = require("./open-AI.js")




module.exports = {
    data: new SlashCommandBuilder()
        .setName("chatgpt")
        .setDescription("Receive response from chatgpt")
        .addStringOption(option =>
            option.setName("data")
                .setDescription("Your question or problem")
                .setRequired(true)
        ),
    execute: async (interaction) => {
        let answer = await questionToIA(interaction.options.getString("data"))
        interaction.reply(answer)
    },
} */