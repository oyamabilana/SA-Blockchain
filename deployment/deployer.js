const fs = require('fs-extra');
const { request } = require('http');
const Web3 = require('web3');
const { Contract } = require('web3-eth-contract');
const {accountExist} = require('./../tests/accountMaster')
const {addAccount} = require('./../tests/accountMaster')
const {masterContract} = require('./../tests/accountMaster')
let web3 = new Web3("http://localhost:8545")

var blockchainUsrAccount;
var bankAccount = "00000"

const deploy = async () => {
  let abi = JSON.parse(fs.readFileSync('bin/contracts/Account.abi').toString())
  let bytecode = fs.readFileSync('bin/contracts/Account.bin').toString()

  await web3.eth.getAccounts().then((accounts) => blockchainUsrAccount = accounts[0])

  let check = await accountExist(bankAccount)

  //Check if this account exists on Master accounts
  if(check == false){
    let deployedContract = new web3.eth.Contract(abi)
      deployedContract.deploy({
      data: bytecode,
      arguments: [web3.utils.asciiToHex(bankAccount)]
      })
      .send({
        from: blockchainUsrAccount,
        gas: 1500000,
        gasPrice: web3.utils.toWei('0.00003', 'ether')
      })
      .then((newContractInstance) => {
        deployedContract.options.address = newContractInstance.options.address
        console.log("deployer >> Bank contract created:", newContractInstance.options.address)
        addAccount(newContractInstance.options.address, bankAccount,blockchainUsrAccount,1500000)
        //the final implementation on real blockchain should wait for  account contract to get mined
        newContractInstance.methods.createTransactionStore().send({from: blockchainUsrAccount,gas: 1500000})
        .then((addr) => console.log("Transaction store: ", addr))
        .catch(error => "Failed to create transaction store")
    })
    .catch(error => console.log("deployer >>Failed: Could not deploy contract, check send() parameters"));
  }else{console.log("deployer >> Denied: This bank account already has an associated contract")}
}

deploy()
