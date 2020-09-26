const fs = require('fs-extra');
const { request } = require('http');
const Web3 = require('web3');
const { Contract } = require('web3-eth-contract');
const {accountExist} = require('./../tests/accountMaster')
const {addAccount} = require('./../tests/accountMaster')
const {masterContract} = require('./../tests/accountMaster')
let web3 = new Web3("http://localhost:8545")

var account = "0x18983711e318245dd2c0bECa017f095f23F068cc" //contract owner address
var bankAccount = "22222"

const deploy = async () => {
  let abi = JSON.parse(fs.readFileSync('bin/contracts/Account.abi').toString())
  let bytecode = fs.readFileSync('bin/contracts/Account.bin').toString()

  let check = await accountExist(bankAccount)

  //Check if this account exists on Master accounts
  if(check == false){
    let deployedContract = new web3.eth.Contract(abi)
      deployedContract.deploy({
      data: bytecode,
      arguments: [web3.utils.asciiToHex(bankAccount)]
      })
      .send({
        from: account,
        gas: 1500000,
        gasPrice: web3.utils.toWei('0.00003', 'ether')
      })
      .then((newContractInstance) => {
        deployedContract.options.address = newContractInstance.options.address
        console.log("deployer >> Bank contract created:", newContractInstance.options.address)
        addAccount(newContractInstance.options.address, bankAccount,account,3000000)
        //the final implementation on real blockchain should wait for  account contract to get mined
        newContractInstance.methods.createTransactionStore().send({from: account,gas: 3000000})
        .then((addr) => console.log("Transaction store: ", addr))
        .catch(error => "Failed to create transaction store")
    })
    .catch(error => console.log("deployer >>Failed: Could not deploy contract, check send() parameters"));
  }else{console.log("deployer >> Denied: This bank account already has an associated contract")}
}

deploy()
