import React, {useEffect, useState} from 'react';
import {Card, CardHeader, Button, Table, CardBody, Spinner, Label} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {toast, ToastContainer} from "react-toastify";
import {useHistory} from "react-router-dom";

const Jobs = (props) => {

    const contract = props.contract;
    const accounts = props.accounts;
    const history = useHistory();


    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTable, setShowTable] = useState(false);

    const [status, setStatus] = useState(null);



    useEffect(()=>{

        const initJobs = async () => {
            try {

                let jobs = [];

                await contract.methods.getJobId().call().then((res)=>{

                    for(let index = 1; index <= res; index++){
                        contract.methods.getJob(index).call().then(res=>{
                            jobs.push(res);
                        });
                    }

                    setJobs(jobs);
                    setLoading(false)
                });




            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
            }

        };

        initJobs().then(err=>console.log(err));



    }, [props.contract]);

    const createJob = async () => {

        history.push('/CreateJob');
    };
    const jobsDisplay = async () => {
        setShowTable(!showTable);
    };

    const requestByFreelancer = async (index) => {
        await contract.methods.confirmByFreelancer(index + 1).send({from: accounts[0], gas: 500000}).then((err, res)=>{
            setStatus(1);
                jobs[index].status = 1;
        });
        await contract.methods.getJob(index + 1).call().then(res=>{
            console.log(res);
        })


    };
    const acceptByEmployer = async (index) => {

        await contract.methods.confirmByEmployer(index + 1, '0x27F82CF1b9D3798b96C02F764eF7c8c423517150').send({from: accounts[0], gas: 500000},(err,txHash)=> {
            if (err) {
                toast.error('This Request is not valid');
            }
            setStatus(2);
            jobs[index].status = 2;
        });
        await contract.methods.getJob(index + 1).call().then(res=>{
            console.log(res);
        })
    };

    const submitByFreelancer = async (index) => {

        await contract.methods.workSubmission(index + 1).send({from: accounts[0], gas: 500000},(err,txHash)=> {
            if (err) {
                toast.error('This Request is not valid');
            }
            setStatus(3);
            jobs[index].status = 3;
        });
        await contract.methods.getJob(index + 1).call().then(res=>{
            console.log(res);
        })

    };
    const payByEmployer = async (index) => {

        let price = jobs[index].price * 1000000000000000000;
        await contract.methods.transfer(index + 1).send({from: accounts[0], gas: 500000, value: price},(err,txHash)=> {
            if (err) {
                toast.error('This Request is not valid');
            }
            setStatus(4);
            jobs[index].status = 4;
        });

        await contract.methods.getJob(index + 1).call().then(res=>{
            console.log(res);
        })

    };


    return(
        loading ? <Spinner></Spinner> :
            <Card>
                <ToastContainer
                    autoClose={2000}
                />
                <CardHeader>Jobs</CardHeader>
                <CardBody>
                    <div><Button color='primary' onClick={()=> createJob()}>+ Create Job</Button></div>
                    <br/>
                    <br/>
                    <div><Button color='info' onClick={()=> jobsDisplay()}>Show Jobs</Button></div>
                    <br/>
                    <br/>

                    {
                        showTable ?
                        <Table>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Desc</th>
                                <th>Status</th>
                                <th>Price</th>
                                <th>Operation</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                jobs.length > 0 ?
                                    jobs.map((item, index)=>{
                                        return(
                                            <tr key={index}>
                                                <td>{index}</td>
                                                <td>{item.title}</td>
                                                <td>{item.description}</td>
                                                <td>{item.status}</td>
                                                <td>{item.price}</td>
                                                <td>
                                                    {
                                                        item.status == 0 ?
                                                        <Button onClick={()=>requestByFreelancer(index)} color='danger'>Request For Work</Button>
                                                            : item.status == 1 ?
                                                            <Button onClick={()=>acceptByEmployer(index)} color='info'>Accept By Employer</Button>
                                                                : item.status == 2 ?
                                                                <Button onClick={()=>submitByFreelancer(index)} color='primary'>Work Is Done</Button>
                                                                    : item.status == 3 ?
                                                                    <Button onClick={()=>payByEmployer(index)} color='success'>Pay The Money</Button>
                                                                    : <Label>Finished</Label>

                                                    }
                                                </td>
                                            </tr>
                                        )
                                    }) : null
                            }

                            </tbody>
                        </Table>
                        : null
                    }
                </CardBody>
            </Card>
    )
};

export default Jobs;
