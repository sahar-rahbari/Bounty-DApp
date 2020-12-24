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
            '0xC16EC9B233210Ec7e99b41e7Fc8b201B3c3FFBFd',
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



export {accountInitialize};
