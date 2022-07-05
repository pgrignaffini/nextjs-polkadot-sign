import React, { useEffect, useState } from 'react'
import {
    web3Accounts,
    web3Enable,
    web3FromSource,
} from '@polkadot/extension-dapp';
import { stringToHex } from "@polkadot/util";
import styles from '../styles/Home.module.css'

export default function TxComponent() {

    const [selectedAccount, setSelectedAccount] = useState(null);
    const [accounts, setAccounts] = useState([]);
    // returns an array of all the injected sources
    // (this needs to be called first, before other requests)
    useEffect(() => {
        async function inject() {
            if (typeof window !== "undefined") {
                const allInjected = await web3Enable('my cool dapp');
                console.log(allInjected);
                const allAccounts = await web3Accounts();
                console.log(allAccounts);
                setAccounts(allAccounts);
            }
        }
        inject();
    }, [])

    const signMessage = async () => {
        // returns an array of { address, meta: { name, source } }
        // meta.source contains the name of the extension that provides this account
        // const allInjected = await web3Enable('my cool dapp');
        // `account` is of type InjectedAccountWithMeta 
        // We arbitrarily select the first account returned from the above snippet
        // to be able to retrieve the signer interface from this account
        // we can use web3FromSource which will return an InjectedExtension type
        try {
            const injector = await web3FromSource(selectedAccount.meta.source);
            // // this injector object has a signer and a signRaw method
            // // to be able to sign raw bytes
            const signRaw = injector?.signer?.signRaw;
            if (!!signRaw) {
                // after making sure that signRaw is defined
                // we can use it to sign our message
                const { signature } = await signRaw({
                    address: selectedAccount.address,
                    data: stringToHex('Confirm your wallet address'),
                    type: 'bytes'
                });
                console.log("Signature: " + signature)
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className={styles.container}>
            <select
                onChange={(e) => {
                    setSelectedAccount(accounts[e.target.value]);
                }}>
                {accounts.map((account, index) => {
                    return <option key={index} value={index}>{account.meta.name}</option>
                })
                }
            </select>
            {selectedAccount ? <button className={styles.button} onClick={signMessage}>Sign</button> : <></>}
        </div>
    )
}
