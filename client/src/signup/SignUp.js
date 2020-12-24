import React, {useEffect, useState} from 'react';
import {Card, CardHeader, Button, FormGroup, Label, Input, CardBody, CardFooter} from 'reactstrap';
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

const SignUp = (props) => {

    const contract = props.contract;
    const accounts = props.accounts;
    const history = useHistory();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
       setLoading(false);


    }, []);

    const loginPage = async () => {
            await contract.methods.signUp(userName, password, role).send({from: accounts[0], gas: 500000},(err,txHash)=> {
                if (err) {
                    toast.error('This address has been already existed');
                }else {
                    contract.events.userIsLogin(
                        {
                            fromBlock: 0,
                            toBlock: 'latest'
                        }, (err,res)=>{
                            setUserName(res.returnValues.userName)
                        }
                    );

                    history.push('/login');
                }
            });
    } ;

    const userNameChange = (event) => {
        setUserName(event.target.value)
    };
    const passwordChange = (event) => {
        setPassword(event.target.value)
    };
    const roleChange = (event) => {
        setRole(event.target.value)
    };


        return(
        <Card>
            {
                !loading ?
                    <React.Fragment>
                        <ToastContainer
                            autoClose={2000}
                        />
                        <CardHeader>Sign In</CardHeader>
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
                            <FormGroup className='col-sm-2'>
                                <Label for="role">Role</Label>
                                <Input
                                    type="select"
                                    name="role"
                                    id="role"
                                    onChange={roleChange}
                                >
                                    <option></option>
                                    <option value={0}>Employer</option>
                                    <option value={1}>Freelancer</option>
                                </Input>
                            </FormGroup>
                            <Button type="submit" color="success" className='col-sm-1' onClick={()=>loginPage()}>Submit</Button>
                        </CardBody>
                    </React.Fragment> : null
            }
        </Card>
    )
};

export default SignUp;
