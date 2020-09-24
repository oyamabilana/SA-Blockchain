// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.1;

/*
*This contract represents a single bank account number
*This contract mirrors the balance and transactions of the bank account
*This contract writes and stores on the blockchain descriptions for the transactions e.g an explanation for why the money was spent


*Only two types of transactions initiated by 2 types of callers can write to this contract
**The sender is an oracle bringing in data from the bank API.
*1 - updates balance
*2 - updates the receiver or sender bank account
*3 - resets transaction reason state variable to empty string
*4 - resets transaction hash state variable to empty string
**The sender is an app bringing in data about the reason for a transaction.
*1 - sets/updates the transaction hash state variable to a valid past transaction hash originating from this contract
*2 - updates transaction reason
*The caller will only read data.

*About storage
*This contract uses overwritable variables to store data, meaning on each send() event to write data to this account 
*the variable values are overwritten. 
*To get the record of all data, this contract leverages the immutability property of blockchain
*This means even if we overwrite variable x in block n, the value of variable x in blocks n-1 is persistant hence 
*data records can be retrieved from older blocks
*/

contract Account{

    bytes15 public bankAccount;                    //This account bank account
    uint    public amount;                         //This account balance
    bytes15 public receiverSenderBankAccount;      //The bank account number of the recipient or sender 
    string  public transactionReason;              //Why the money was spent
    string  public transactionHash;                //referres to a transaction that was initiated by this account via the bank oracle
    address public owner;                          //address that initiated this contract
    address public bankOracle;

    constructor(bytes15  _bankAccount) {
        bankAccount = _bankAccount;
        owner = msg.sender;
        bankOracle = msg.sender; //TODO: Change this before finalising
    }

    /*
    *This function updates the contract amount/balance to match the bank account balance
    *We mirror the updated balance of the real bank account instead of updating the value
    *by addition or subtracting. This makes sure that bank transaction fees are accurately 
    *recorded on the final balance
    *@params _amount the current balance of the real bank account
    */
    function setBalance(uint _amount) onlyBank public {
        amount = _amount;
        transactionReason = ""; 
        transactionHash   = ""; 
    }

    /*
    *This function records a reason for a transaction / change in balance of the bank account
    *@params reason for why the transaction was made
    *@params transactionHash of the bank transaction - when the contract amount changed
    */
    function setReason(string memory _transactionrReason,string memory _transactionHash) onlyOwner public{
        transactionReason = _transactionrReason;
        transactionHash   = _transactionHash;
    }

    function getReason(/*string memory _transactionHash*/) public view returns(string memory) {
        return transactionReason;
    }

    function setReceiverSenderBankAccount(bytes15 _receiverSenderBankAccount) onlyBank public {
        receiverSenderBankAccount = _receiverSenderBankAccount;
    }

    function getReceiverSenderBankAccount() public view returns(bytes15) {
        return receiverSenderBankAccount;
    }

    modifier onlyOwner{
        require(owner == msg.sender,
        "Denied: Sender not authorized");
        _;
    }

    modifier onlyBank{
        require(bankOracle == msg.sender,
        "Access denied: Only the bank oracle can execute this transaction");
        _;
    }
}
