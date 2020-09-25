const fs = require('fs-extra')
var Web3 = require('web3');
const { Contract } = require('web3-eth-contract');
let web3 = new Web3("http://localhost:8545")

var account;

web3.eth.getAccounts().then((accounts) => {
    account = accounts[9]
    setBalance();
    setReceiverSender();
})

let abi = JSON.parse(fs.readFileSync('bin/contracts/Account.abi').toString())

let contract = new web3.eth.Contract(abi);
contract.options.address = "0x6e702abCba35FF412d5717e0FCe44410eaf3BdBC"

function setBalance(){
    contract.methods.setBalance(103432).send({from: account}).then((result) => console.log(result))
}

function setReceiverSender(){
    contract.methods.setReceiverSenderBankAccount(web3.utils.asciiToHex('99999')).send({from: account, gas:3000000})
    .then((receipt) => console.log('Sender\n', receipt))
}