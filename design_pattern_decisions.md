
# Bounty App (DApp) 

## Design Pattern

### Restricting Access

#### We restrict function access so that only specific addresses are permitted to execute functions.

Modifiers:  In this contract  we use six modifiers to control different items.

IsOwner: To control that the sender of the message for some functions (such as deleting the contract) is the contract owner. Other people cannot execute these functions.

isDuplicated: To check that the user who registers in the system has not previously registered with his account address, otherwise a message will be displayed to the user to prevent re-registration.

isRegisteredUser: The user's ID and password are checked when logging in with the username and password entered during registration so a user with the same address cannot access  to another user's page.

isValidRole: When the user wants to create a job, it  had to be controlled that role be of the employer type.

IsValidJob: When multiple requests are made to change the desired job status, this modifier checks the identity and current status of the desired job so the process does not change in the event  if there is a problem.


``` bash
    modifier isOwner() {
        require(msg.sender == owner, 'The address is not owner !!');
        _;
    }

    modifier isDuplicated() {
        require(user[msg.sender].exist != true , 'The user has already been existed !!!');
        _;
    }

    modifier isRegisteredUser(string _userName, string _password) {
        require(user[msg.sender].exist == true , 'The user has not been registered !!!');
        require( keccak256(user[msg.sender].userName) == keccak256(_userName) , 'The username is invalid');
        require( keccak256(user[msg.sender].password) == keccak256(_password) , 'The password is invalid');
        _;
    }

    modifier isValidRole(int _role) {
        require(user[msg.sender].role == _role , 'The user has not correct role !!!');
        _;
    }

    modifier isValidJob(int _status, int _jobId) {
        require(job[_jobId].exist == true, 'The job is not registered');
        require(job[_jobId].status == _status, 'The job is already in process');
        _;
    }

    modifier isValidTransfer(int _jobId){
        require(job[_jobId].employer == msg.sender, 'The employer is invalid !!');
        require(msg.sender.balance > job[_jobId].price, 'No enough money to pay');
        _;
    }

```

