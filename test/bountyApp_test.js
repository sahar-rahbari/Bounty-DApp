let BountyApp = artifacts.require('./BountyApp');

contract('BountyApp', function(accounts) {

    let contract;
    let contractCreator = accounts[0];
    let freelancer = accounts[1];
    const ONE_ETH = 1;

    beforeEach(async function() {
        contract = await BountyApp.new({from: contractCreator, gas: 5000000});
    });

    it('user is registered', async function() {
        await contract.signUp('userName_1', 'lastName_1', 0, {from: contractCreator});

        let userProfile = await contract.user.call(contractCreator);
        let userName = userProfile[1];
        expect(userName).to.equal('userName_1');
        let password = userProfile[2];
        expect(password).to.equal('lastName_1');
        let role = userProfile[3];
        expect(role.toNumber()).to.equal(0);
        let exist = userProfile[4];
        expect(exist).to.equal(true);

    });


    it('job is posted', async function() {
        await contract.createJob('title_1', 'desc_1', 0, 1,{from: contractCreator});

        let jobProfile = await contract.job.call(1);
        let title = jobProfile[0];
        expect(title).to.equal('title_1');
        let description = jobProfile[1];
        expect(description).to.equal('desc_1');
        let employer = jobProfile[2];
        expect(employer).to.equal(contractCreator);
        let status = jobProfile[4];
        expect(status.toNumber()).to.equal(0);

    });


    it('job is confirmed by freelancer', async function() {
        await contract.createJob('title_1', 'desc_1', 0, 1,{from: contractCreator});
        await contract.signUp('userName_2', 'lastName_2', 1, {from: freelancer});
        await contract.confirmByFreelancer(1, {from: freelancer});

        let jobProfile = await contract.job.call(1);
        let title = jobProfile[0];
        expect(title).to.equal('title_1');
        let description = jobProfile[1];
        expect(description).to.equal('desc_1');
        let employer = jobProfile[2];
        expect(employer).to.equal(contractCreator);
        let status = jobProfile[4];
        expect(status.toNumber()).to.equal(1);

    });


    it('freelancer is confirmed by employer', async function() {
        await contract.createJob('title_1', 'desc_1', 1, 1,{from: contractCreator});
        await contract.confirmByEmployer(1, freelancer, {from: contractCreator});

        let jobProfile = await contract.job.call(1);
        let title = jobProfile[0];
        expect(title).to.equal('title_1');
        let description = jobProfile[1];
        expect(description).to.equal('desc_1');
        let employer = jobProfile[2];
        expect(employer).to.equal(contractCreator);
        let freelancerAddress = jobProfile[3];
        expect(freelancerAddress).to.equal(freelancer);
        let status = jobProfile[4];
        expect(status.toNumber()).to.equal(2);

    });


    it('job is submitted by freelancer', async function() {
        await contract.signUp('userName_2', 'lastName_2', 1, {from: freelancer});
        await contract.createJob('title_1', 'desc_1', 1, 1,{from: contractCreator});
        await contract.confirmByEmployer(1, freelancer, {from: contractCreator});
        await contract.workSubmission(1, {from: freelancer});

        let jobProfile = await contract.job.call(1);
        let title = jobProfile[0];
        expect(title).to.equal('title_1');
        let description = jobProfile[1];
        expect(description).to.equal('desc_1');
        let employer = jobProfile[2];
        expect(employer).to.equal(contractCreator);
        let freelancerAddress = jobProfile[3];
        expect(freelancerAddress).to.equal(freelancer);
        let status = jobProfile[4];
        expect(status.toNumber()).to.equal(3);

    });


    it('money has been transfered', async function() {
        await contract.signUp('userName_2', 'lastName_2', 1, {from: freelancer});
        await contract.createJob('title_1', 'desc_1', 1, 1,{from: contractCreator});
        await contract.confirmByEmployer(1, freelancer, {from: contractCreator});
        await contract.workSubmission(1, {from: freelancer});
        await contract.transfer(1, {value: 1000000000000000000, from: contractCreator});

        let jobProfile = await contract.job.call(1);
        let title = jobProfile[0];
        expect(title).to.equal('title_1');
        let description = jobProfile[1];
        expect(description).to.equal('desc_1');
        let employer = jobProfile[2];
        expect(employer).to.equal(contractCreator);
        let freelancerAddress = jobProfile[3];
        expect(freelancerAddress).to.equal(freelancer);
        let status = jobProfile[4];
        expect(status.toNumber()).to.equal(4);
        let price = jobProfile[5].toNumber();
        expect(price).to.equal(ONE_ETH);
    });


    it('event is emitted', async function() {
        let watcher = contract.jobIsFinished();
        await contract.signUp('userName_2', 'lastName_2', 1, {from: freelancer});
        await contract.createJob('title_1', 'desc_1', 1, 1,{from: contractCreator});
        await contract.confirmByEmployer(1, freelancer, {from: contractCreator});
        await contract.workSubmission(1, {from: freelancer});
        await contract.transfer(1, {value: 1, from: contractCreator});

        let events = await watcher.get();
        let event = events[0];
        expect(event.args.jobId.toNumber()).to.equal(1);
        expect(event.args.finished).to.equal(true);
    });

});
