# Blur.io-bidding-sales-tracking-bot

## **Description**
A Node.js bot created to track bidding sales on blur.io for specific contract addresses. The bot listens to new Ethereum block headers and cross-checks them against the user-defined contract address. If a matching contract is found, it will output the bidding details such as token ID and token value in the console.

![example-of-tracker](https://user-images.githubusercontent.com/129596891/229293972-299e3a51-82f9-4f1e-afc5-921b8298b820.PNG)


## **Table of Contents**
#### 1. <ins>Installation</ins>
#### 2. <ins>Usage</ins>
#### 3. <ins>Configuration</ins>
#### 4. <ins>License</ins>
<br>

### **Installation**
#### Prerequisites
* Make sure to have Node.js 14.x or higher installed
* Make sure to have npm installed 
* [Guide to install node.js](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac#windows "Guide to install node.js")

#### Step-by-step Installation Guide
1. Clone the repository:
`git clone https://github.com/greyspace-eth/blur-bidding-sales-tracker.git`

2. Change to the project directory:
`cd blur-bidding-sales-tracker`

3. Install the required dependencies:
`npm install`

4. Follow the <ins>Configuration</ins> section to set up the necessary environment variables.

### **Usage**
1. Update the contract_address variable in app.js with your desired contract address. <br> `const contract_address = 'YOUR_CONTRACT_ADDRESS'`

2. Start the bot: `node app.js`

3. The bot will listen to new block headers and output bidding details in the console if a matching contract is found.

### **Configuration**
1. Create a .env file in the project's root directory.

2. Add the following contents to the file, adjusting the values as needed: <br> `eth_api_key=YOUR_ETHERSCAN_API_KEY` [Guide for Etherscan API](https://docs.etherscan.io/getting-started/viewing-api-usage-statistics "Guide for Etherscan API") <br>
`eth_web_socket=wss://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_WSS_KEY` [Guide for Alchemy API](https://docs.alchemy.com/docs/alchemy-quickstart-guide "Guide for Alchemy API")

### **License**

## **Credits and Attribution**
* If you find this project helpful or use it in your own work: 
  * Please consider giving credit to the original author.
  * Feel free to buy me some coffee at **0x9C063A0d0eCd247DeDf3988b8F6C1e543e171cE9**.

## **Additional**
* Feel free to incorporate telegram bot to broadcast the information on telegram instead of desktop console.
* Feel free to add more contract addresses to track. Just have to adjust the contract_address to an array and loop it.

