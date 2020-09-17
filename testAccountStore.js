const fs = require('fs-extra')
var Web3 = require('web3');
const { Contract } = require('web3-eth-contract');
let web3 = new Web3("http://localhost:8545")

var account;

web3.eth.getAccounts().then((accounts) => {
    console.log(accounts[1])
    account = accounts[1]
    addAccount();
    //CheckAccount();
})

let abi = JSON.parse(fs.readFileSync('AccountStore_sol_AccountStore.abi').toString())

let contract = new web3.eth.Contract(abi);
contract.options.address = "0x1570BFbA8c81dc69b7Bd191dD8faf61415cCD6Aa"

function addAccount(){
    contract.methods.addAccount("0x39A1Ce51C3744D7663DB875a59a869F705de4bD1", web3.utils.asciiToHex('0000000000')).send({from: account, gas:3000000})
    .then((receipt) => console.log(receipt))
}

function CheckAccount(){
    contract.methods.CheckAccount(web3.utils.asciiToHex('0000000000')).call().then((address) => console.log(address))
}
