const fs = require('fs-extra')
var Web3 = require('web3');
const {accountExist, getContractAddress} = require('./../tests/accountMaster')
const { Contract } = require('web3-eth-contract');
let web3 = new Web3("http://localhost:8545")
let abi = JSON.parse(fs.readFileSync('bin/contracts/Account.abi').toString())

var account = "0x38dE5fC74021673Cf5Ac555bf704C56d56c6E862"  //bank oracle address
let contract;

let runUpdate = async () => {
    //get the conract with this bank account
    await getContract("22222");
    //update this contract
    bankUpdate(255035,"4444")
}

let getContract = async (_bankAccount) => {
    contract = new web3.eth.Contract(abi);
    let check = await accountExist(_bankAccount);
    if(check == true){contract.options.address = await getContractAddress(_bankAccount)}
}

function bankUpdate(_amount,_receiverSenderBankAccount){
    contract.methods.bankUpdate(_amount, web3.utils.asciiToHex(_receiverSenderBankAccount))
    .send({from: account, gas: 3000000})
    .then((receipt) => console.log("oracle-bank >> contract updated successfully\n",receipt))
}

let test = async () => {
    //get the conract with this bank account
    await getContract("22222");
    contract.methods.amount().call().then((balance) => console.log("Balance: ", balance))
    contract.methods.receiverSenderBankAccount().call().then((result) => console.log("Sender/Receiver: ", web3.utils.toAscii(result)))
    contract.methods.transactionStoreAddress().call().then((addr)=> console.log("Transaction store addr: ", addr))
    contract.methods.bankOracle().call().then((result) => console.log("Bank oracle: ", result))
}

test();
//runUpdate();