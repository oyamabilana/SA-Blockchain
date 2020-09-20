const fs = require('fs-extra')
var Web3 = require('web3');
const { Contract } = require('web3-eth-contract');
let web3 = new Web3("http://localhost:8545")

var account;

web3.eth.getAccounts().then((accounts) => {
    account = accounts[2]
    //updateBalance()
    //getBalance()
    //getBankAccount()
    //setReason()
    //setReceiverSender()
    getReceiverSender()
})

let abi = JSON.parse(fs.readFileSync('bin/contracts/Account.abi').toString())

let contract = new web3.eth.Contract(abi);
contract.options.address = "0xb7Bdd1Fe9cDBF4Ae46CF4e8cc2fa306772160eD8"

function getBankAccount(){
    contract.methods.getBankAccount().call().then((bankAccount) => {console.log("First retrieval ", web3.utils.toAscii(bankAccount));})
}

function getBalance(){
    contract.methods.getBalance().call().then((result) => console.log("Balance: ", result))
}

function setBalance(){
    contract.methods.setBalance(12324).send({from: account}).then((result) => console.log(result))
}

function setReason(){
    contract.methods.setReason("Payed for the Isibaya project", '0x872efcdcc449c9650377ec4ad5d5b40f6e0fd9b22fdd50d8249fb7637715ac0b')
    .send({from: account, gas: 3000000}).then((receipt) => console.log(receipt))
}

function setReceiverSender(){
    contract.methods.setReceiverSenderBankAccount(web3.utils.asciiToHex('1111111111111')).send({from: account, gas:3000000})
    .then((receipt) => console.log('Receiver set\n', receipt))
}

function getReceiverSender(){
    contract.methods.getReceiverSenderBankAccount().call().then((receiver) => console.log('Receiver: ', web3.utils.toAscii(receiver)))
}