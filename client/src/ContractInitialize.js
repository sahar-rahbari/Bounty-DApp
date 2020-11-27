import getWeb3 from "./getWeb3";
import BountyApp from "./ethereum/BountyApp";
import abiDecoder from "abi-decoder";

const accountInitialize = async () =>{
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            return await web3.eth.getAccounts();

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }

};

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
            '0xb948c19C6a37228AEc270926eCA7C1395Fd080Fa',
        );
        abiDecoder.addABI(BountyApp.abi);
        web3.eth.handleRevert = true;
        // Set web3, accounts, and contract to the state, and then proceed with an
        return instance;

    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    }

};

const web3Initialize = async () =>{
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
            '0xb948c19C6a37228AEc270926eCA7C1395Fd080Fa',
        );
        abiDecoder.addABI(BountyApp.abi);
        web3.eth.handleRevert = true;
        // Set web3, accounts, and contract to the state, and then proceed with an
        return web3;

    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    }

};


export {accountInitialize, contractInitialize, web3Initialize};
