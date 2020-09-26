const fs = require('fs-extra')
var Web3 = require('web3');
const {accountExist} = require('./accountMaster')
const {getContractAddress} = require('./accountMaster')
const { Contract } = require('web3-eth-contract');
let web3 = new Web3("http://localhost:8545")

/**
 * This app records reasons for the transactions initiated by the bank oracle
 */

var bankAccount = "77777"
var account = "0x99e835F236D0D9E135f4e3433D6EEf992270F4bB"; //contract owner address
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

let getPastEvents = async () => {
    await getTransactionStore("77777")
    transactionStore.getPastEvents('Reason',{fromBlock: 'earliest', toBlock: 'latest'}).then((event) => console.log(event[0].returnValues))
}

getPastEvents();
//getTransactionStore(bankAccount);
//setReason(bankAccount,"Payed for the Isibaya project", '0xa39b9643cb2d3374745e2f412f7d49e27f4a814452492f39e1168c2adf7088a4');