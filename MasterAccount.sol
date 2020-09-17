// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.1;

/**
*This simple contract keeps track of deployed Accounts contracts with their associated Bank accounts.
*/
contract AccountStore{
    //contract address => Bank account number
    struct Account{
        address contractAddress;
        bytes32 bankAccountNumber;
    }

    Account account;
    Account [] public storedAccounts;
    address private NULL = 0x1111111111111111111111111111111111111111;

    constructor(){
    }

    /*
    *This method maps a new contract address to a bank account : contract address => bank account number
    *@params _contractAddress newly created contract address 
    *@params _bankAccountNumber bank account that we just created a contract for
    */
    function addAccount(address _contractAddress, bytes32 _bankAccountNumber) public {
        account.contractAddress = _contractAddress;
        account.bankAccountNumber = _bankAccountNumber;
        storedAccounts.push(account);
    }

    /*
    *This method takes a bank account number and verifies if it has an associated contract
    *@params _bankAccountNumber the bank account number to check
    *@returns the contract address of the bank account if it exists.
    *@returns NULL a default address if the contract doesn't exist.
    */
    function CheckAccount(bytes32 _bankAccountNumber) public view returns(address){
        for(uint i= 0; i< storedAccounts.length; i++){
            if(storedAccounts[i].bankAccountNumber == _bankAccountNumber){
                return storedAccounts[i].contractAddress;
            }
        }
        return NULL;
    }
}