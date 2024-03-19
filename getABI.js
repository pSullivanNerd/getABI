//I'm using v5 of ethers so be sure to use: "npm install ethers@5"
const { ethers } = require('ethers');
const readlineSync = require('readline-sync');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function main() {
    
    const contractAddress = readlineSync.question('Please enter your smart contract address: ');

    const provider = new ethers.providers.JsonRpcProvider('https://o-rpc.testnet.hyper.blockfabric.net:8669');

    const contractABI = [{
        "constant": true,
        "inputs": [],
        "name": "getABI",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }];

    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const ipfsUri = await contract.getABI();
    console.log(`ABI IPFS URI: ${ipfsUri}`);

    const ipfsHash = ipfsUri.replace('ipfs://', '');

    const ipfsGatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

    try {
        const response = await axios.get(ipfsGatewayUrl, { responseType: 'arraybuffer' });
        const filename = path.join(__dirname, `${ipfsHash}.json`);
        fs.writeFileSync(filename, response.data);
        console.log(`File downloaded and saved as ${filename}`);
    } catch (error) {
        console.error('Error downloading the file from IPFS:', error);
    }
}

main().catch(console.error);
