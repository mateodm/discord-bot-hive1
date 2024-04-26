const axios = require("axios")

async function consult(account) {
    let offset = 0
    let legendary = 0
    let epic = 0
    let rare = 0
    let totalResults = 1000
    let transport = 0
    let people = 0
    let instruments = 0
    do {
        let response = await axios.post("https://custr.ryamer.com/contracts", { "jsonrpc": "2.0", "id": 10, "method": "find", "params": { "contract": "nft", "table": "STARinstances", "query": { "account": account }, "limit": 1000, "offset": offset, "indexes": ["account"] } })
        console.log(response)
        let parcialData = response.data.result
        totalResults = parcialData.length
        offset += 1000
        parcialData.forEach(data => {

            if (data.properties.type.startsWith("L") && /^\d/.test(data.properties.type.slice(1))) {
                legendary++
                if(data.properties.class === "people") {
                    people++
                }
                else if(data.properties.class === "instruments") {
                    instruments++
                }
                else if(data.properties.class === "transport") {
                    transport++
                }
            }
            else if (data.properties.type.startsWith("E") && /^\d/.test(data.properties.type.slice(1))) {
                epic++
                if(data.properties.class === "people") {
                    people++
                }
                else if(data.properties.class === "instruments") {
                    instruments++
                }
                else if(data.properties.class === "transport") {
                    transport++
                }
            }
            else if (data.properties.type.startsWith("R") && /^\d/.test(data.properties.type.slice(1))) {
                rare++
                if(data.properties.class === "people") {
                    people++
                }
                else if(data.properties.class === "instruments") {
                    instruments++
                }
                else if(data.properties.class === "transport") {
                    transport++
                }
            }
            else {
                if(data.properties.class === "people") {
                    people++
                }
                else if(data.properties.class === "instrument") {
                    instruments++
                }
                else if(data.properties.class === "transport") {
                    transport++
                }
            }
        })
    }
    while (totalResults === 1000);
    if (totalResults !== 1000) {
        rare = rare.toString()
        epic = epic.toString()
        legendary = legendary.toString()
        people = people.toString()
        instruments = instruments.toString()
        transport = transport.toString()
        let json = { rare: rare, epic: epic, legendary: legendary, people: people, vehicles: transport, instruments: instruments }
        return json
    }

}

module.exports = { consult }