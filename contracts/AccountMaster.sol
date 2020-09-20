// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.1;

/**
*This simple contract keeps track of deployed Accounts contracts with their associated Bank accounts.
*/
contract AccountMaster{
    //contract address => Bank account number
    struct Account{
        address contractAddress;
        bytes15 bankAccountNumber;
    }

    Account account;
    Account [] public storedAccounts;
    address private NULL = 0x1111111111111111111111111111111111111111;
    event AddAccount (address indexed _contractCreator);

    constructor(){
    }

    /*
    *This method maps a new contract address to a bank account : contract address => bank account number
    *@params _contractAddress newly created contract address 
    *@params _bankAccountNumber bank account that we just created a contract for
    */
    function addAccount(address _contractAddress, bytes15 _bankAccountNumber) public {
        require(accountExist(_bankAccountNumber) == false, "Denied: This bank account already has an associated contract");
        account.contractAddress = _contractAddress;
        account.bankAccountNumber = _bankAccountNumber;
        storedAccounts.push(account);
        emit AddAccount(msg.sender);
    }

    /*
    *This method takes a bank account number and returns the asscociated contract address
    *@params _bankAccountNumber the bank account number to check
    *@returns the contract address of the bank account if it exists.
    *@returns NULL a default address if the contract doesn't exist.
    */
    function getAccount(bytes15 _bankAccountNumber) public view returns(address){
        for(uint i= 0; i< storedAccounts.length; i++){
            if(storedAccounts[i].bankAccountNumber == _bankAccountNumber){
                return storedAccounts[i].contractAddress;
            }
        }
        return NULL;
    }

    /*
    *This function gets a mapping of bank accounts with their contract addresses
    *bankAccountNumber => contractAddress
    *@returns address[] contract address list
    *@returns bytes15[] bank account numbers corresponding to the contract addresses
    */
    function getAllAccounts() public view returns(address[] memory data1, bytes15[] memory data2){
        address [] memory contractAddress   = new address[](storedAccounts.length);
        bytes15 [] memory accountNumber = new bytes15[](storedAccounts.length);

        for(uint i=0; i < storedAccounts.length; i++){
            contractAddress[i] = storedAccounts[i].contractAddress;
            accountNumber[i] = storedAccounts[i].bankAccountNumber;
        }

        return (contractAddress, accountNumber);
    }

    /*
    *This method takes a bank account number and verifies if it has an associated contract
    *@params _bankAccountNumber the bank account number to check
    *@returns true if this bank account is recorded on the master account
    *@returns false if this bank account is not recorded on the master account
    */

    function accountExist(bytes15 _bankAccountNumber) public view returns(bool){
        for(uint i= 0; i< storedAccounts.length; i++){
            if(storedAccounts[i].bankAccountNumber == _bankAccountNumber){
                return true;
            }
        }
        return false;
    }
}