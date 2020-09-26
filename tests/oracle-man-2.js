const fs = require('fs-extra')
var Web3 = require('web3');
const {accountExist} = require('./../tests/accountMaster')
const {getContractAddress} = require('./../tests/accountMaster')
const { Contract } = require('web3-eth-contract');
let web3 = new Web3("http://localhost:8545")

var bankAccount = "22222"
var account = "0x18983711e318245dd2c0bECa017f095f23F068cc"; //contract owner address
let contract;
let transactionStore;

let abi = JSON.parse(fs.readFileSync('bin/contracts/Account.abi').toString())
let transactionStoreAbi = JSON.parse(fs.readFileSync('bin/contracts/TransactionStore.abi').toString())

let getTransactionStore = async (_bankAccount) => {
    await getContract(bankAccount);
    await contract.methods.transactionStoreAddress().call().then((addr) => {
        console.log("Transaction Store address: ", addr);
        transactionStore = new web3.eth.Contract(transactionStoreAbi, addr);
    })   
}

const getContract = async (_bankAccount) => {
    contract = new web3.eth.Contract(abi);
    let check = await accountExist(_bankAccount);
    if(check == true){contract.options.address = await getContractAddress(_bankAccount)}
    console.log("Check: ", check)
}

async function setReason(_bankAccount,_reason,_transactionHash){
    await getTransactionStore(_bankAccount)
    transactionStore.methods.setReason(_reason,_transactionHash)
    .send({from: account, gas: 3000000}).then((receipt) => console.log(receipt))
}

//getTransactionStore(bankAccount);
setReason(bankAccount,"Payed for the Isibaya project", '0x872efcdcc449c9650377ec4ad5d5b40f6e0fd9b22fdd50d8249fb7637715ac0b');