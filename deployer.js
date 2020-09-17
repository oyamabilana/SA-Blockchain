const fs = require('fs-extra')
const Web3 = require('web3');
let web3 = new Web3("http://localhost:8545")
//web3.eth.getAccounts(console.log)

const deploy = async () => {
  let abi = JSON.parse(fs.readFileSync('Account_sol_Account.abi').toString())
  let bytecode = fs.readFileSync('Account_sol_Account.bin').toString()
  var bankAccount = "0000000000"

  let deployedContract = new web3.eth.Contract(abi)
  deployedContract.deploy({
    data: bytecode,
    arguments: [web3.utils.asciiToHex(bankAccount)]
    }).send({
      from: '0x1ecFF9734CB19e29f2d658973864F29E83c5Afd6',
      gas: 1500000,
      gasPrice: web3.utils.toWei('0.00003', 'ether')
    }).then((newContractInstance) => {
      deployedContract.options.address = newContractInstance.options.address
      console.log(newContractInstance.options.address)
  });
}

deploy()
