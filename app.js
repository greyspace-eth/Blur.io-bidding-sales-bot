require('dotenv').config();
const eth_api_key = process.env.eth_api_key;
const eth_web_socket = process.env.eth_web_socket;
const axios = require('axios');
const Web3 = require('web3');
const provider = new Web3.providers.WebsocketProvider(eth_web_socket,{clientConfig:{maxReceivedFrameSize: 10000000000,maxReceivedMessageSize: 10000000000,}});
const web3 = new Web3(provider);

const contract_address = '0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258' // {EDIT TO YOUR DESIRED CONTRACT ADDRESS}
const ERC1155_TRANSFER_TOPIC_SIGNATURE = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const ERC1155_TRANSFER_SINGLE_TOPIC_SIGNATURE = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62';
const ERC1155_TRANSFER_BATCH_TOPIC_SIGNATURE = '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb';

async function getContractAddressName(contract_address){
    var reqUrl = 'https://api.etherscan.io/api?module=contract&action=getabi&address='+ contract_address +'&apikey='+ eth_api_key;
    var response = await axios.get(reqUrl);
    if(response.data.status.toString() === '1'){
        var contractABI = JSON.parse(response.data.result);
        var nftCon = await new web3.eth.Contract(contractABI, contract_address);
        var name = ''
        try{
            name = await nftCon.methods.name().call();
        }catch(err){
            console.log('getContractAddressName method has error, no name method found', err);
        }
    }
    return name;
}

async function getNFTTransactionInContractAddress(transactionhash,contract_address,contractAddressName){ 
    var nftIdArray = []
    var nftValueArray = []
    var transaction = await web3.eth.getTransaction(transactionhash);
    var transactionReceipt = await web3.eth.getTransactionReceipt(transactionhash);
    var isCorrectContractAddress = false
    if(transaction.input){
        if(transaction.input.includes(contract_address.slice(2).toLowerCase())){
            isCorrectContractAddress = true;
        }
        var transactionMethodId = transaction.input.substring(0,10);
    }
    const blur_execute_method = '0x9a1fc3a7';
    const blur_bulk_execute_method = '0xb3be57f8';

    //console.log(transaction);
    //console.log(transactionReceipt);

    //check if transaction contract address is inputed contract address
    if(isCorrectContractAddress){
        //means that this transfer transaction value is 0, potential bidding order
        if((transactionMethodId=== blur_execute_method || transactionMethodId === blur_bulk_execute_method) && transaction.value.toString() === '0'){ 
            //check deeper into transactionReceipt whether is a bidding order
            for (var logNo = 0; logNo < transactionReceipt.logs.length; logNo++){ 
                const firstTopic = transactionReceipt.logs[logNo].topics[0]; 
                //checking if its a transfer method/transaction 
                if(firstTopic === ERC1155_TRANSFER_TOPIC_SIGNATURE || firstTopic === ERC1155_TRANSFER_SINGLE_TOPIC_SIGNATURE || firstTopic === ERC1155_TRANSFER_BATCH_TOPIC_SIGNATURE){ 
                    //only will have this topic[3] if there is a tokenID/nftID
                    if(transactionReceipt.logs[logNo].data.toString() === '0x' && transactionReceipt.logs[logNo].topics[3]){ 
                        var nftID = await web3.eth.abi.decodeParameter('uint256',transactionReceipt.logs[logNo].topics[3]);
                        nftIdArray.push(nftID);
                        //console.log(`This is NFT token id #${nftID}, hex value = (${transactionReceipt.logs[logNo].topics[3]})`);
                    }else{ //transfer method/iopic to find nft value
                        var nftValue = parseFloat(Web3.utils.fromWei(web3.eth.abi.decodeParameter('uint256',transactionReceipt.logs[logNo].data),'ether'));
                        nftValueArray.push(nftValue);
                        //console.log(`This is NFT token value ${nftValue} ETH, hex value = (${transactionReceipt.logs[logNo].data})`);
                    }
                }
            }

            var allNftId = '';
            var allNftValue = 0;
            if(nftIdArray.length>0){
                for(i=0;i<nftIdArray.length;i++){
                    allNftId += ' #' + nftIdArray[i].toString();
                }
            }
            if(nftValueArray.length>0){
                for(i=0;i<nftValueArray.length;i++){
                    allNftValue += parseFloat(nftValueArray[i]);
                }
            }
            // Information
            console.log(`Contract Address : ${contractAddressName} (${contract_address}) \n In transaction hash ${transactionhash}, Bidding order on blur sold${allNftId} @ the total value of ${allNftValue} ETH.`);
        }
    }
}

//run name function once
var contractAddressName;
(async () => {
    contractAddressName = await getContractAddressName(contract_address);
})();
//ws to receive new token information (new blockheaders)
const scan_newblock = web3.eth.subscribe('newBlockHeaders'); //this is listening to new blocks mined on the blockchain
scan_newblock.on("error ", console.error);
scan_newblock.on("data", async function(blockHeader){
var block = await web3.eth.getBlock(blockHeader.hash);
var transactions = block.transactions;
for (var tIndex = 0; tIndex < transactions.length; tIndex++){
    var transactionhash = transactions[tIndex];
    await getNFTTransactionInContractAddress(transactionhash,contract_address,contractAddressName);
}
});
