import React, {useEffect, useState} from 'react';
import {Card, CardHeader, Button, CardBody, FormGroup, Label, Input} from 'reactstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useLocation,
    useHistory,
    Redirect
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = (props) => {

    const history = useHistory();

    const contract = props.contract;
    const accounts = props.accounts;


    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        setLoading(false);

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

                history.push('/Jobs');
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
            {
                !loading ?
                    <React.Fragment>
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
                    </React.Fragment> : null
            }
        </Card>
    )
};

export default Login;
