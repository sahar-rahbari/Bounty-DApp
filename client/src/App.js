import React, {useEffect, useState} from "react";
import BountyApp from "./ethereum/BountyApp.json";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import getWeb3 from "./getWeb3";
import abiDecoder from 'abi-decoder';
import "./App.css";
import SignUp from "./signup/SignUp";
import Login from "./signup/Login";
import Jobs from "./Job/Jobs";
import CreateJob from "./Job/CreateJob";
import {accountInitialize, contractInitialize, web3Initialize} from "./ContractInitialize";

const App = (props) => {

    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);


    useEffect(()=>{

        accountInitialize().then(acc => setAccounts(acc));
        contractInitialize().then(contract => setContract(contract));
        web3Initialize().then(web3 => setWeb3(web3));

    }, []);

    return (
        <Router>
                <Switch>
                    <Route exact path='/' component={SignUp} />
                    <Route path='/login' component={Login} />
                    <Route path='/Jobs' component={Jobs} />
                    <Route path='/CreateJob' component={CreateJob} />
                </Switch>
        </Router>
    );
};

export default App;
