import React, {useEffect, useState} from 'react';
import {Card, CardHeader, Button, CardBody, FormGroup, Label, Input} from 'reactstrap';
import getWeb3 from "../getWeb3";
import BountyApp from "../ethereum/BountyApp";
import abiDecoder from "abi-decoder";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {accountInitialize, contractInitialize,  web3Initialize} from "../ContractInitialize";

const Login = (props) => {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(()=>{

        accountInitialize().then(acc => setAccounts(acc));
        contractInitialize().then(contract => setContract(contract));
        web3Initialize().then(web3 => setWeb3(web3));

    }, []);

    const login = async () => {
        await contract.methods.login(userName,password).send({from: accounts[0], gas: 500000},(err,txHash)=> {
            if (err) {
                toast.error('This information is not valid');
            }else {
                contract.events.userIsLogin(
                    {
                        fromBlock: 0,
                        toBlock: 'latest'
                    }, (err,res)=>{
                        setUserName(res.returnValues.userName);
                    }
                );

                props.history.push('/Jobs');
            }
        });
    } ;

    const userNameChange = (event) => {
        setUserName(event.target.value)
    };
    const passwordChange = (event) => {
        setPassword(event.target.value)
    };

    return(

        <Card>
            <ToastContainer
                autoClose={2000}
            />
            <CardHeader>Login</CardHeader>
            <CardBody>
                <FormGroup className='col-sm-4'>
                    <Label for="userName">User Name</Label>
                    <Input
                        type="text"
                        name="userName"
                        id="userName"
                        placeholder="User Name"
                        onChange={userNameChange}
                    />
                </FormGroup>
                <FormGroup className='col-sm-4'>
                    <Label for="password">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        onChange={passwordChange}
                    />
                </FormGroup>
                <Button type="submit" color="success" className='col-sm-1' onClick={()=>login()}>Login</Button>
            </CardBody>
        </Card>
    )
};

export default Login;
