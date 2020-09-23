const fs = require('fs-extra')
const Web3 = require('web3')
let web3 = new Web3("http://localhost:8545")
//web3.eth.getAccounts(console.log)

var blockchainUsrAccount;
let contract;

const deploy = async () => {
  let abi = JSON.parse(fs.readFileSync('bin/contracts/AccountMaster.abi').toString())
  let bytecode = fs.readFileSync('bin/contracts/AccountMaster.bin').toString()

  await web3.eth.getAccounts().then((accounts) => blockchainUsrAccount = accounts[0])

  let deployedContract = new web3.eth.Contract(abi)
    deployedContract.deploy({
    data: bytecode
    })
    .send({
      from: blockchainUsrAccount,
      gas: 1500000,
      gasPrice: web3.utils.toWei('0.00003', 'ether')
    })
    .then((newContractInstance) => {
      deployedContract.options.address = newContractInstance.options.address
      console.log("master-deployer >> Master account: ",newContractInstance.options.address)
      fs.writeFileSync('./deployment/account-master-address', newContractInstance.options.address)
    })
    .catch(error => console.log("master-deployer >>Failed: Could not deploy contract, check send() parameters"));
}

deploy()
