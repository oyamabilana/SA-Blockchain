// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.1;

/*
*This contract writes and stores on the blockchain descriptions for the transactions e.g an explanation for why the money was spent
*This contract sets/updates the transaction hash state variable to a valid past transaction hash originating from this contract
*updates transaction reason
*The sender is an oracle bringing in data from web application with transaction description

*NB There are no getter methods other than those implicitely created by state variables
*Because we aren't interested in current state of the contract but it's history
*retrieving data will be done on web3 interface querying block data for transactionhash or account address
*/

contract TransactionStore{
    
    address public owner;
    address public parentAccount;
    string  public transactionReason;              //Why the money was spent
    string  public transactionHash;                //referres to a transaction that was initiated by this account via the bank oracle
    event   Reason(string transacionHash, string transactionReason, uint timestamp);

    constructor(address _owner, address _parentAccount){
        owner = _owner;
        parentAccount = _parentAccount;
    }

    /*
    *This function records a reason for a transaction / change in balance of the bank account
    *@params reason for why the transaction was made
    *@params transactionHash of the bank transaction - when the contract amount changed
    */
    function setReason(string memory _transactionrReason,string memory _transactionHash) onlyOwner public{
        transactionReason = _transactionrReason;
        transactionHash   = _transactionHash;
        emit Reason(_transactionHash, transactionReason, block.timestamp);
    }

    modifier onlyOwner{
        require(owner == msg.sender,
        "Denied: Sender not authorized");
        _;
    }
}
