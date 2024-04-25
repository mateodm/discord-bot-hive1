const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios")
const { generateTable, generateTableBalance } = require("../utils/tableGenerator.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getbalance")
        .setDescription("Check HIVE account balance")
        .addStringOption(option =>
            option.setName("account")
                .setDescription("Your account")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("token")
                .setDescription("Token in UPPERCASE (IMPORTANT)")
                .setRequired(false)
        ),
    execute: async (interaction) => {
        interaction.deferReply();
        let account = interaction.options.getString("account")
        let token = interaction.options.getString("token")
        if (account && token) {
            let body = { "method": "contracts.find", "jsonrpc": "2.0", "params": { "contract": "tokens", "table": "balances", "query": { "account": `${account}`, "symbol": `${token}` }, "limit": 1000, "offset": 0, "indexes": [] }, "id": 1 }
            let response = await axios.post("https://engine.rishipanthee.com/", body)
            if (response.data.result.length > 0) {
                let result = response.data.result
                let filterData = result.map(filter => ({
                    Account: filter.account,
                    Symbol: filter.symbol,
                    Balance: filter.balance,
                    Stake: filter.stake,
                    PendingUnstake: filter.pendingUnstake
                }))
                let table = generateTable(filterData)
                interaction.editReply(`\`\`\`\n${table}\n\`\`\``);
            }
            else {
                await interaction.editReply("The user entered does not exist or params invalid. Please enter the token in UPPERCASE")
            }
        }
        else if (account) {
            let body = { "method": "contracts.find", "jsonrpc": "2.0", "params": { "contract": "tokens", "table": "balances", "query": { "account": `${account}` }, "limit": 1000, "offset": 0, "indexes": [] }, "id": 1 }
            let response = await axios.post("https://engine.rishipanthee.com/", body)
            let result = response.data.result
            let balance = []
            if (result.length > 0) {
                let tokenInterested = ["STARBITS", "STARPRO", "ZING", "SWAP.HIVE", "SWAP.SWIFT", "DEC", "SPS", "SWAP.MATIC", "SWAP.USDT", "SWAP.HBD", "BEE", "BUDS", "HKWATER", "MOTA", "PIZZA", "SPT", "SWAP.WAX", "KOD", "HUESO", "COLONY", "SCRIPT", "PART", "VALOR", "ORIGINS", "SCRAP", "FORGE", "STELLARUM", "HIQS", "PXL", "SIM", "CCD", "WOO", "CROP"];

                const filterResults = result.filter(filter => tokenInterested.includes(filter.symbol));
                filterResults.map(filter => {
                    try {
                        let symbol = { [filter.symbol]: filter.balance }
                        balance.push(symbol)
                    }
                    catch(e) {
                        console.log(e)
                    }

                })
                let table = generateTableBalance(balance, account)
                interaction.editReply(`\`\`\`\n${table}\n\`\`\``);
            }
            else {
                await interaction.editReply("The user entered does not exist or the parameters are incorrectly set")
            }
        }
    },
}