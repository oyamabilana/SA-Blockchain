# SA-Blockchain
A private blockchain for tracking South African public funds 

# NB:
I have carried on development on a different repo after doing more research on the topic. I aim to post the new repo after I've done enough progress.
After studying the public SCM in greater depth I realized my approach (this repo) was futile however this still forms the basis of my greater endeavour of minimising
public SCM fraud.

# Objectives
This project aims to minimize public supply chain fraud by using Ethereum blockchain.

# A walk through
1. A bank transaction is made, the listening oracle is updated about this transaction through the bank API
2. The listening oracle records on the blockchain the transaction amount and recipient/sender account number ** account; could be encrypted for privacy/security concerns.
3. The account manager reads this transaction from the blockchain and adds ONLY the reason for the transaction.
4. The tranasction and reason/explanation for the transaction are stored immutably on the blockchain.
.
--Not implemented
5. A SQL Database is setup on a private server to read the latest State of the Accounts and serves as a basis for a Block explorer just for these accounts
6. The public easily consumes this data from the block explorer

# Why this project?
Tackling the excuse of "Missing documentation" when reports are due for audits.
No risking auditors lives when running after missing documents.
Civil society has realtime updates of the public purse and can verify themselves if indeed the funds have been used according to what the reports say in a timely 
fashion instead of waiting for quarter/semester/anual reports when little can be done.

# Technical Details
In summary this repo consists of:
Ethereum smart contracts written in Solidity:
  
Account.sol //Represents a bank account

TransactionStore.sol //Stores on the blockchain the reasons for the transactions associated with a single Account.sol

AccountMaster.sol //Manages all owned Account.sol contracts 
  
Contract deployers written in JavaScript:

master-deployer.js //Deploys the AccountMaster.sol contract

deployer.js //Deploys an Account.sol contract and it's associated TransactionStore.sol

bankEventListener.js or oracleBank.js //An oracle that simulates receiving transaction information from a Bank API and updating the associated Account.sol contract

oracle-man-*.js //An oracle that listens to a user to enter information about what the transaction was for then updates the TransactionStore.sol

# This concept doesn't consider the legal constraints in depth. 
