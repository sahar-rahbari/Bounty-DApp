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

const App = (props) => {

    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);


    const contractInitialize = async () =>{
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();


            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = BountyApp.networks[networkId];
            const instance = new web3.eth.Contract(
                BountyApp.abi,
                '0x1e345a31E1CA0C870607B560Fc66CaA2E10017e5',
            );
            abiDecoder.addABI(BountyApp.abi);
            web3.eth.handleRevert = true;

            // Set web3, accounts, and contract to the state, and then proceed with an
            return {instance,accounts,web3};

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }

    };


    useEffect(()=>{

        contractInitialize().then(res => {

            setContract(res.instance);
            setAccounts(res.accounts);
            setWeb3(res.web3);
            setLoading(false);
        });

    }, []);

    return (
        <Router>
            <Switch>
                <Route path="/CreateJob">
                    <CreateJob contract={contract} accounts={accounts} web3={web3}/>
                </Route>
                <Route path="/Jobs">
                    <Jobs contract={contract} accounts={accounts} web3={web3}/>
                </Route>
                <Route path="/login">
                    <Login contract={contract} accounts={accounts} web3={web3}/>
                </Route>
                <Route path="/">
                    <SignUp contract={contract} accounts={accounts} web3={web3}/>
                </Route>

            </Switch>
        </Router>
    );
};

export default App;
