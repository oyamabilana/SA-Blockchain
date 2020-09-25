const fs = require('fs-extra');
const { type } = require('os');
var Web3 = require('web3');
const { Contract } = require('web3-eth-contract');
let web3 = new Web3("http://localhost:8545")

var account;

web3.eth.getAccounts().then((accounts) => {
    //console.log(accounts[1])
    //account = accounts[1]
    //addAccount();
    //console.log(accountExist('0000000000'))
    //getAllAccounts().then((result) => console.log(result))
    //console.log(getContractAddress("00000"));

})

let abi = JSON.parse(fs.readFileSync('bin/contracts/AccountMaster.abi').toString())

let contract = new web3.eth.Contract(abi);
contract.options.address = fs.readFileSync('./deployment/account-master-address').toString()

exports.masterContract = contract; 
exports.addAccount = async function(contractAddress,bankAccount,usrAddress, gasAmount){
    contract.methods.addAccount(contractAddress, web3.utils.asciiToHex(bankAccount)).send({from: usrAddress, gas: gasAmount})
    .then((receipt) => console.log(receipt))
    .catch(error => console.log("accountMaster >> Denied: This bank account already has an associated contract"))
}

exports.accountExist = async function (bankAccount){
    var returnValue;
    await contract.methods.accountExist(web3.utils.asciiToHex(bankAccount)).call()
    .then((result) => console.log("accountMaster >> Account exists: ",returnValue = result))
    .catch(error => console.log("accountMaster >> 1.Denied: Cannot verify bank account\n2.verify bank account format is less than 16 characters"))
    return returnValue
}

exports.getContractAddress = async function(bankAccount){
    var returnValue;
    await contract.methods.getContractAddress(web3.utils.asciiToHex(bankAccount)).call()
    .then((result) => console.log("accountMaster >> Contract address for account ",bankAccount," :",returnValue = result))
    .catch(error => console.log("accountMaster >> 1.Denied: Cannot verify bank account\n2.verify bank account format is less than 16 characters"))
    return returnValue
}

exports.getAllAccounts = async function(){
    let accountsMap = new Map()
    const CONTRACT_ADDRESSES_ROW =0;
    const BANK_ACCOUNTS_ROW=1;
    await contract.methods.getAllAccounts().call().then((result1) => {
        for(let i = 0; i < result1[CONTRACT_ADDRESSES_ROW].length; i++){
            accountsMap.set(result1[0][i], web3.utils.toAscii(result1[BANK_ACCOUNTS_ROW][i]))
        }
    })
    return accountsMap
}