const hive = require('@hiveio/hive-js');
require('dotenv').config();


async function buyOrder(id, price) {
    console.log(id, price)
    const customJsonData = [
        {
            "contractName": "nftmarket",
            "contractAction": "buy",
            "contractPayload": {
                "symbol": "STAR",
                "nfts": [
                    `${id}`
                ],
                "expPrice": `${price}`,
                "expPriceSymbol": "STARBITS",
                "marketAccount": "risingstargame"
            }
        }
    ]

    hive.broadcast.customJson(process.env.active, ["meveofrivia"], [], 'ssc-mainnet-hive', JSON.stringify(customJsonData), (err, result) => {
    });
}

module.exports = {buyOrder}