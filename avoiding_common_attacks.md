
# Bounty App (DApp) 

## Security Analysis

### TxOrigin Attack (SWC-115)

I have been used msg.sender instead of tx.origin.

Examples :

``` bash
    constructor() public {
        owner= msg.sender;
    }
	
	function createJob(string _title, string _description, int _status, uint _price) public isValidRole(0) returns (JobProfile) {

		require(msg.sender.balance >= _price, 'Not enough money to pay');

		jobId = jobId + 1;
		job[jobId].title = _title;
		job[jobId].description = _description;
		job[jobId].employer = msg.sender;
		job[jobId].status = _status;
		job[jobId].price = _price;
		job[jobId].exist = true;

		emit jobIsCreated(jobId, _title, _description, msg.sender, job[jobId].freelancer, _status, _price, true);

		return job[jobId];

    }
	
    function workSubmission(int _jobId) public isValidRole(1) isValidJob(2, _jobId) returns (JobProfile){

        require(job[_jobId].freelancer == msg.sender , 'The user is not the freelancer for this job !!!');

        job[_jobId].status = 3;

        return job[_jobId];

    }
	
```

### Integer Over/Underflow

We used uint256 for user's Id mapping to have large number of Ids. Also we used positive numbers for jobId to have number of jobs every time. It can helps to prevent underflow for job ids.

### commonly attacks

We have controlled the massage sender balance to transfer money. Employer should have enough money to create jobs.

