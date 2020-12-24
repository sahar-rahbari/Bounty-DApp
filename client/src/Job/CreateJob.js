import React, {useEffect, useState} from 'react';
import {Card, CardHeader, Button, CardBody, FormGroup, Label, Input} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {toast, ToastContainer} from "react-toastify";
import {useHistory, useLocation} from "react-router-dom";


const CreateJob = (props) => {

    const contract = props.contract;
    const accounts = props.accounts;
    const web3 = props.web3;
    const history = useHistory();
    const location = useLocation();

    const [jobId, setJobId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [employer, setEmployer] = useState('');
    const [status, setStatus] = useState(0);
    const [price, setPrice] = useState(null);


    useEffect(()=>{


    }, []);

    const addJob = async () => {
        await contract.methods.createJob(title,description,0, price).send({from: accounts[0], gas: 500000},(err,txHash)=> {
            if (err) {
                toast.error('The user can not create job');
            }else {
                contract.events.jobIsCreated(
                    {
                        fromBlock: 0,
                        toBlock: 'latest'
                    }, (err,res)=>{
                        setJobId(res.returnValues.jobId);
                        setTitle(res.returnValues.title);
                        setDescription(res.returnValues.description);
                        setEmployer(res.returnValues.employer);
                        setStatus(res.returnValues.status);
                        setPrice(res.returnValues.price);
                    }
                );
                history.push('/Jobs');
            }
        });
    } ;

    const titleChange = (event) => {
        setTitle(event.target.value)
    };
    const descChange = (event) => {
        setDescription(event.target.value)
    };
    const priceChange = (event) => {
        setPrice(event.target.value)
    };


    return(
        <Card>
            <ToastContainer
                autoClose={2000}
            />
            <CardHeader>Create Job</CardHeader>
            <CardBody>
                <FormGroup className='col-sm-4'>
                    <Label for="title">Title</Label>
                    <Input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Title"
                        value={title}
                        onChange={titleChange}
                    />
                </FormGroup>
                <FormGroup className='col-sm-4'>
                    <Label for="description">Description</Label>
                    <Input
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Description"
                        onChange={descChange}
                    />
                </FormGroup>
                <FormGroup className='col-sm-4'>
                    <Label for="price">Price</Label>
                    <Input
                        type="text"
                        name="price"
                        id="price"
                        placeholder="Price"
                        onChange={priceChange}
                    />
                </FormGroup>
                <Button type="submit" color="success" className='col-sm-1' onClick={()=>addJob()}>Add Job</Button>
            </CardBody>
        </Card>
    )
};

export default CreateJob;
