import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

import wavePortalAbi from "../contracts/WavePortal.json";
import useWindowFocus from "./useWindowFocus";
import algosdk, { waitForConfirmation } from "algosdk";
import { CONSTANTS } from './Constants';

const CONTRACT_ADDRESS = "0x08EDCa063262FD50c97C825110f1Ab71111f0759";
const appIndex = CONSTANTS.APP_ID;

if (!localStorage.getItem('PeraWallet.BridgeURL')) {
	localStorage.setItem('PeraWallet.BridgeURL', 'wss://a.bridge.walletconnect.org')
}

export const Reaction = {
	Wave: 0,
	Cake: 1,
	Hype: 2,
};

let client = new algosdk.Algodv2(CONSTANTS.algodToken, CONSTANTS.baseServer, CONSTANTS.port)

export const WriteStatus = {
	None: 0,
	Connect: 1,
	Request: 2,
	Pending: 3,
};

const EvmName = {
	80001: "Polygon Mumbai",
};

const EvmChain = {
	Mumbai: 80001,
};

export default function useWallet(peraWallet) {
	const [loading, setLoading] = useState(true);
	const [writeLoading, setWriteLoading] = useState(WriteStatus.None);
	const [walletInstalled, setInstalled] = useState(true);
	const [walletConnected, setConnected] = useState(false);
	const [walletNetwork, setNetwork] = useState(null);
	const [walletAccount, setAccount] = useState("");
	const [optedIn, setOptedIn] = useState(false)
	const [inMatch, setInMatch] = useState(false)
	const [defeated, setDefeated] = useState(false)
	const [upgrade, setUpgrade] = useState(false)
	const [walletError, setWalletError] = useState(null);
	const [waveList, setWaveList] = useState([]);
	const [globalStates, setGlobalStates] = useState([]);
	const [showAttack, setShowAttack] = useState(false);
	const [totalWaves, setTotalWaves] = useState(null);
	const [critChance, setCritChance] = useState(null);
	const [upgradeStats, setUpgradeStats] = useState({
		health: 0,
		attack: 0,
		defense: 0
	});

	const upgradePoints = 20;
	const statsUsed = useMemo(() => upgradeStats.health + upgradeStats.attack + upgradeStats.defense >= upgradePoints, [upgradeStats])

	const networkName = useMemo(() => {
		if (!walletNetwork) {
			return "";
		}
		return EvmName[walletNetwork?.chainId] || walletNetwork.name;
	}, [walletNetwork]);
	const isMumbai = walletNetwork?.chainId === EvmChain.Mumbai;

	const isWindowFocused = useWindowFocus();

	useEffect(() => {
		if (isWindowFocused) {
			// check status whenever the window focus status changes
		}
		const runUpdates = async () => {
			// setInstalled(getWalletInstalled());
			setConnected(await getWalletConnected());
			// updateWaves();
			setLoading(false);
		};
		runUpdates();
	}, [isWindowFocused, setInstalled, setConnected, setLoading]);

	const nanParser = (val) => {
		return isNaN(val) ? 0 : val
	}

	const checkOptedIn = async (sender, index) => {
		try {
			const counter = await client.getApplicationByID(index).do();
			if (!!counter.params['global-state']) {
				setGlobalStates(counter.params['global-state'].map(_ => ({key: atob(_.key), value: _.value.uint})))
			}
			const appInfo = await client.accountApplicationInformation(sender, index).do();
			if (appInfo['app-local-state']) {
				if (appInfo['app-local-state']['key-value']) {
					const todoList = appInfo['app-local-state']['key-value']
					if (todoList.length > 0) {
						const finalTodo = todoList.map(_ => ({key: atob(_.key), value: _.value.uint}))
						setInMatch(nanParser(finalTodo.find(_ => _.key === 'in_match')?.value) ?? false)
						setUpgrade(nanParser(finalTodo.find(_ => _.key === 'upgrade_player')?.value) ?? false)
						setDefeated(!nanParser(finalTodo.find(_ => _.key === 'hp')?.value) > 0 ?? false)
						setWaveList(finalTodo)
					} else {
						setWaveList([])
					}
				} else {
					setWaveList([])
				}
				
				setOptedIn(true)
			}
			setShowAttack(false)
		} catch (e) {
			console.log(e)
			setShowAttack(false)
		  	setOptedIn(false)
		  	// console.error(`There was an error calling the app: ${e}`);
		}
	}

	const connectWallet = () => {
		// await AlgoSigner.connect()
		//     getUserAccount()
		return peraWallet.connect().then((newAccounts) => {
			// setup the disconnect event listener
			/* eslint-disable */
			peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);
			checkOptedIn(newAccounts[0], CONSTANTS.APP_ID)
			setAccount(newAccounts)
			setConnected(true)
			return newAccounts
		});
	}

	const onTodoAction = async (action, message) => {
		return await noop(appIndex, action, message, walletAccount[0])
	}


	const waveReaction = async (reaction, message) => {
		if (!walletInstalled) {
			return;
		}

		if (!walletConnected) {
			setWriteLoading(WriteStatus.Connect);
			await connectWallet();
			setConnected(await getWalletConnected());
		}
		setWriteLoading(WriteStatus.Request);

		writeWave(reaction, message)
			.then(async (transaction) => {
				setWriteLoading(WriteStatus.Pending);

				await transaction.wait();
				setWriteLoading(WriteStatus.None);
			})
			.catch((error) => {
				window.alert("Failed to write transaction!");
				console.error(error);
				setWriteLoading(WriteStatus.None);
			});
	};

	async function getWalletConnected() {
		return peraWallet.reconnectSession().then((accounts) => {
			// Setup disconnect event listener
			peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);
	
			if (accounts.length) {
				setAccount(accounts)
				checkOptedIn(accounts[0], appIndex)
				return true
			}
		})
	}

	const optIn = async () => {
		try {
		  const index = CONSTANTS.APP_ID
		  const sender = walletAccount[0]
		  const suggestedParams = await client.getTransactionParams().do();
		  const optInTxn = algosdk.makeApplicationOptInTxn(
			sender,
			suggestedParams,
			index
		  );
		  const actionTxGroup = [{ txn: optInTxn, signers: [sender] }];
		  const signedTx = await peraWallet.signTransaction([actionTxGroup]);
		  console.log(signedTx);
		  const { txId } = await client.sendRawTransaction(signedTx).do();
		  const result = await waitForConfirmation(client, txId, 4);
		  console.log(`Success`);
		  setOptedIn(true)
		  checkOptedIn(sender, appIndex)
		} catch (e) {
		  setOptedIn(false)
		  console.error(`There was an error calling the app: ${e}`);
		}
	}

	function randomIntFromInterval(min, max) { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min).toString()
	}

	function numberToBytes(number) {
		// you can use constant number of bytes by using 8 or 4
		const len = Math.ceil(Math.log2(number) / 8);
		const byteArray = new Uint8Array(len === -Infinity ? 0 : len);
	
		for (let index = 0; index < byteArray.length; index++) {
			const byte = number & 0xff;
			byteArray[index] = byte;
			number = (number - byte) / 256;
		}
		return byteArray;
	}

	const noop = async (index, action)  => {
		try{
		  const accounts = await peraWallet.reconnectSession()
		  const sender = accounts[0]
		  const appArgs = []
		  if (action === 'attack_boss') {
			appArgs.push(
				new Uint8Array(Buffer.from(action)),
				numberToBytes(critChance),
				numberToBytes(randomIntFromInterval(1,4)),
				numberToBytes(randomIntFromInterval(1,4)),
			  )
		  } else if (action === 'upgrade_stats') {
			appArgs.push(
				new Uint8Array(Buffer.from(action)),
				numberToBytes(upgradeStats.health),
				numberToBytes(upgradeStats.attack),
				numberToBytes(upgradeStats.defense),
			  )
		  } else {
			appArgs.push(
				new Uint8Array(Buffer.from(action)),
			  )
		  }
		  
		  const suggestedParams = await client.getTransactionParams().do();
		  // create unsigned transaction
		  let actionTx = algosdk.makeApplicationNoOpTxn(sender, suggestedParams, index, appArgs)
		  // Sign the transaction
		  const actionTxGroup = [{ txn: actionTx, signers: [sender] }];
	  
		  const signedTx = await peraWallet.signTransaction([actionTxGroup]);
		  setShowAttack(true)
		  console.log(signedTx);
		  const { txId } = await client.sendRawTransaction(signedTx).do();
		  const confirmedTxn = await waitForConfirmation(client, txId, 4);
		  console.log("confirmed" + confirmedTxn)
	  
		  //Get the completed Transaction
		  console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
	  
		  // display results
		  let transactionResponse = await client.pendingTransactionInformation(txId).do();
		  console.log("Called app-id:",transactionResponse['txn']['txn']['apid'])
		  if (transactionResponse['global-state-delta'] !== undefined ) {
			  console.log("Global State updated:",transactionResponse['global-state-delta']);
		  }
		  if (transactionResponse['local-state-delta'] !== undefined ) {
			  console.log("Local State updated:",transactionResponse['local-state-delta']);
		  }
		  setUpgradeStats({
			health: 0,
			attack: 0,
			defense: 0
		  })
		  checkOptedIn(sender, CONSTANTS.APP_ID)
		  console.log('success')
		}catch(err){
		  console.log(err)
		}
	  }

	const sendWave = (message) => waveReaction(Reaction.Wave, message);
	const sendCake = (message) => waveReaction(Reaction.Cake, message);
	const sendHype = (message) => waveReaction(Reaction.Hype, message);

	function handleDisconnectWalletClick() {
		localStorage.removeItem('walletconnect')
		localStorage.removeItem('PeraWallet.Wallet')
		setConnected(false)
		setAccount(null)
		setOptedIn(false)
		setInMatch(false)
		setDefeated(false)
		setUpgrade(false)
		setWaveList([])
		setGlobalStates([])
		setShowAttack(false)
		setCritChance(false)
		setUpgradeStats({
			health: 0,
			attack: 0,
			defense: 0
		})

	}

	return {
		loading,
		writeLoading,
		walletInstalled,
		walletConnected,
		walletAccount,
		walletError,
		connectWallet,
		networkName,
		isMumbai,
		waveList,
		totalWaves,
		optedIn,
		sendWave,
		peraWallet,
		sendCake,
		sendHype,
		optIn,
		onTodoAction,
		handleDisconnectWalletClick,
		globalStates,
		inMatch,
		upgrade,
		upgradeStats,
		setUpgradeStats,
		upgradePoints,
		statsUsed,
		defeated,
		showAttack,
		critChance,
		setCritChance,
	};
}