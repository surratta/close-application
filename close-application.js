#!/usr/bin/env node

const blake2 = require("blake2");
const url = "https://api.close.com/buildwithus/";

async function main() {
    
    const getResponse = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    const getResponseJson = await getResponse.json();
    //console.log(getResponseJson);
    const hashKey = getResponseJson.key;
    const traits = getResponseJson.traits;
    const hashedTraits = [];
    
    for (const trait of traits) {
        const hash = blake2.createKeyedHash("blake2b", Buffer.from(hashKey));
        hash.update(Buffer.from(trait));
        hashedTraits.push(hash.digest("hex"));
    }
    
    const postResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hashedTraits),
    });
    
    const verificationID = await postResponse.text();
    console.log(verificationID);
}

main();
