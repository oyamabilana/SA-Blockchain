const fs = require('fs-extra')
var Web3 = require('web3');
const {accountExist} = require('./../tests/accountMaster')
const {getContractAddress} = require('./../tests/accountMaster')
const { Contract } = require('web3-eth-contract');
let web3 = new Web3("http://localhost:8545")

var bankAccount = "44444"
var account;
let contract;

let abi = JSON.parse(fs.readFileSync('bin/contracts/Account.abi').toString())

let run = async () => {
    web3.eth.getAccounts().then((accounts) => {account = accounts[0]})
    await initiateContract();
    contract.methods.transactionStoreAddress().call().then((addr) => {console.log("Transaction Store address: ", addr);})
}

const initiateContract = async () => {
    contract = new web3.eth.Contract(abi);
    let check = await accountExist(bankAccount);
    if(check == true){contract.options.address = await getContractAddress(bankAccount)}
}

function getBankAccount(){
    contract.methods.amount().call().then((bank) => {console.log("First retrieval ", web3.utils.toAscii(bank));})
}

function setReason(){
    contract.methods.setReason("Payed for the Isibaya project", '0x872efcdcc449c9650377ec4ad5d5b40f6e0fd9b22fdd50d8249fb7637715ac0b')
    .send({from: account, gas: 3000000}).then((receipt) => console.log(receipt))
}

function getReceiverSender(){
    contract.methods.receiverSenderBankAccount().call().then((receiver) => console.log('Receiver: ', web3.utils.toAscii(receiver)))
}

run();