// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.1;
import "./TransactionStore.sol";

/*
*This contract represents a single bank account number
*This contract mirrors the balance and transactions of the bank account

**The sender is an oracle bringing in data from the bank API.
*1 - updates balance
*2 - updates the receiver or sender bank account
*3 - resets transaction reason state variable to empty string
*4 - resets transaction hash state variable to empty string
**The sender is an app bringing in data about the reason for a transaction.

*About storage
*This contract uses overwritable variables to store data, meaning on each send() event to write data to this account 
*the variable values are overwritten. 
*To get the record of all data, this contract leverages the immutability property of blockchain
*This means even if we overwrite variable x in block n, the value of variable x in blocks n-1 is persistant hence 
*data records can be retrieved from older blocks


*NB There are no getter methods other than those implicitely created by state variables
*Because we aren't interested in current state of the contract but it's history
*retrieving data will be done on web3 interface querying block data for transactionhash or account address
*/

contract Account{

    bytes15 public bankAccount;                     //This account bank account
    uint    public amount;                          //Amount paid or received rounded off to nearest rand
    uint    public accountBalance;                  //This account balance rounded off to nearest rand
    bytes15 public receiverSenderBankAccount;       //The bank account number of the recipient or sender 
    address public owner;                           //address that initiated this contract
    address public bankOracle;
    TransactionStore public transStore;
    address public transactionStoreAddress;
    bool    private transactionStoreCreated = false;
    uint8   constant public PAID = 0;
    uint8   constant public RECEIVED = 1;
    uint8   public transactionType;
    event   Transact(uint transactionType,bytes15 receiverSenderBankAccount,uint amount,uint accountBalance, uint timestamp);

    constructor(bytes15  _bankAccount) {
        bankAccount = _bankAccount;
        owner = msg.sender;
        bankOracle = 0x38dE5fC74021673Cf5Ac555bf704C56d56c6E862;
        accountBalance = 100;   //TODO: pass the value to be asigned to accountBalance at first
    }

    /**
    *This function instantiates TransactionStore contract and can only be called once and only once
    *This function once called can never be called again for the lifetime of this contract
    */
    function createTransactionStore() onlyOwner public{
        require(transactionStoreCreated == false);
        transStore = new TransactionStore(owner,address(this));
        transactionStoreAddress = address(transStore);
        transactionStoreCreated = true;
    }

    /*
    *This function updates the contract balance to match the bank account balance
    *and the account number of the receipient/sender
    *We mirror the updated balance of the real bank account instead of updating the value
    *by addition or subtracting. This makes sure that bank transaction fees are accurately 
    *recorded on the final balance
    *@params _amount the current balance of the real bank account
    *@params _receiverSenderBankAccount of the bank account money was sent to or from
    */

    function bankUpdate(uint newBalance, bytes15 _receiverSenderBankAccount) onlyBank public {
        if(newBalance > accountBalance ){
            transactionType = RECEIVED;
            amount = newBalance - accountBalance;
        }
        else {
            transactionType = PAID;
            amount = accountBalance - newBalance;
        }
        accountBalance = newBalance;
        receiverSenderBankAccount = _receiverSenderBankAccount;
        emit Transact(transactionType,_receiverSenderBankAccount,amount,accountBalance, block.timestamp);
    }

    /*  
    *This function changes the bank oracle that serves data to this contract
    *Only the bank oracle can authenticate this transaction
    *e.g. The current bank oracle hands over it's previliges to a new bank oracle
    *@params _newBankOracle the address of the new bank oracle that will replace the current one
    */
    function updateOracle(address _newBankOracle) onlyBank public{
        bankOracle = _newBankOracle;
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
