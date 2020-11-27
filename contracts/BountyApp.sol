pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "./Utils.sol";

contract BountyApp{

    using Utils for *;

    int userId = 0;
    int jobId = 0;
    address private owner;

    struct UserProfile{
        int id;
        string userName;
        string password;
        int role;
        bool exist;
    }

    struct JobProfile{
        string title;
        string description;
        address employer;
        address freelancer;
        int status;
        uint price;
        bool exist;

    }

    mapping(address => UserProfile) public user;
    mapping(int => JobProfile) public job;

    event jobIsFinished(
        int jobId,
        bool finished
    );


    event userIsLogin(
        int id,
        string userName,
        string password,
        int role,
        bool exist
    );

    event jobIsCreated(
        int jobId,
        string title,
        string description,
        address employer,
        address freelancer,
        int status,
        uint price,
        bool exist
    );


    event jobIdNow(
        int jobId
    );



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

    constructor() public {
        owner= msg.sender;
    }

    function signUp(string _userName, string _password, int _role) public isDuplicated returns (UserProfile){

        userId = userId + 1;

        user[msg.sender].id = userId;
        user[msg.sender].userName = _userName;
        user[msg.sender].password = _password;
        user[msg.sender].role = _role;
        user[msg.sender].exist = true;

        emit userIsLogin(userId, _userName, _password, _role, true);

        return user[msg.sender];

    }

    function login(string _userName, string _password) public isRegisteredUser(_userName, _password) returns (UserProfile) {

        emit userIsLogin(user[msg.sender].id, user[msg.sender].userName, user[msg.sender].password, user[msg.sender].role, user[msg.sender].exist);

        return user[msg.sender];

    }

    function createJob(string _title, string _description, int _status, uint _price) public isValidRole(0) returns (JobProfile) {

        require(msg.sender.balance >= _price, 'Not enough money to pay');

        jobId = jobId + 1;
        job[jobId].title = _title;
        job[jobId].description = _description;
        job[jobId].employer = msg.sender;
        job[jobId].status = _status;
        job[jobId].price = Utils.etherToWei(_price);
        job[jobId].exist = true;

        emit jobIsCreated(jobId, _title, _description, msg.sender, job[jobId].freelancer, _status, Utils.etherToWei(_price), true);

    return job[jobId];

    }

    function getJobId() public returns(int) {
        emit jobIdNow(jobId);
        return jobId;
    }


    function getJob(int _jobId) public returns(JobProfile) {

        emit jobIsCreated(_jobId, job[_jobId].title, job[_jobId].description, job[_jobId].employer, job[_jobId].freelancer, job[_jobId].status, job[_jobId].price, true);
        return job[_jobId];
    }

    function confirmByFreelancer(int _jobId) public isValidRole(1) isValidJob(0, _jobId) returns (address){

        job[_jobId].status = 1;

        return msg.sender;

    }

    function confirmByEmployer(int _jobId, address _freelancer) isValidRole(0) isValidJob(1, _jobId) public returns (JobProfile){

        require(job[_jobId].employer == msg.sender , 'The user is not the employer for this job !!!');

        job[_jobId].status = 2;
        job[_jobId].freelancer = _freelancer;

        return job[_jobId];

    }

    function workSubmission(int _jobId) public isValidRole(1) isValidJob(2, _jobId) returns (JobProfile){

        require(job[_jobId].freelancer == msg.sender , 'The user is not the freelancer for this job !!!');

        job[_jobId].status = 3;

        return job[_jobId];

    }


    function transfer(int _jobId) public payable isValidTransfer(_jobId) returns (JobProfile){

        job[_jobId].status = 4;

        job[_jobId].freelancer.send(msg.value);

        emit jobIsFinished(_jobId, true);

        return job[_jobId];

    }


    function remove() private isOwner{
        selfdestruct(0x0);
    }
}
