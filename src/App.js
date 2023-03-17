import * as React from "react";

import Bio from "./components/Bio";
import Header from "./components/Header";
import SendWave from "./components/SendWave";
import Wallet from "./components/Wallet";

import useWallet from "./hooks/useWallet";

import "./App.css";
import WaveList from "./components/WaveList";
import UpgradePlayer from "./components/UpgradePlayer";
import AttackBoss from "./components/AttackBoss";
import Ressurect from "./components/Ressurect";
import bg1 from './assets/bg1.jpg'
import bg2 from './assets/bg2.jpg'
import bg3 from './assets/bg3.jpg'
import bg4 from './assets/bg4.jpg'
import bg5 from './assets/bg5.jpg'
import bg6 from './assets/bg6.jpg'
import bg7 from './assets/bg7.jpg'
import bg8 from './assets/bg8.jpg'

export default function App({peraWallet}) {
	const {
		walletInstalled,
		walletConnected,
		networkName,
		isMumbai,
		connectWallet,
		loading,
		writeLoading,
		waveList,
		totalWaves,
		sendWave,
		sendCake,
		optIn,
		optedIn,
		sendHype,
		onTodoAction,
		handleDisconnectWalletClick,
		globalStates,
		upgrade,
		upgradeStats,
		setUpgradeStats,
		upgradePoints,
		statsUsed,
		inMatch,
		defeated,
		showAttack,
		critChance,
		setCritChance,
		trigger,
		setTrigger
	} = useWallet(peraWallet);


	React.useEffect(()  => {
		const bgs = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8]
		const rand = bgs[Math.floor(Math.random() * bgs.length)]
		document.body.style.backgroundImage = `url(${rand})`
	}, [trigger]);

	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<Header />
				<Wallet
					handleDisconnectWalletClick={handleDisconnectWalletClick}
					optedIn={optedIn}
					optIn={optIn}
					loading={loading}
					walletInstalled={walletInstalled}
					walletConnected={walletConnected}
					isMumbai={isMumbai}
					networkName={networkName}
					connectWallet={connectWallet}
				/>
				<Bio optedIn={optedIn} walletConnected={walletConnected}  stats={waveList} />
				<UpgradePlayer
					upgrade={upgrade} 
					upgradeStats={upgradeStats} 
					setUpgradeStats={setUpgradeStats}
					upgradePoints={upgradePoints}
					statsUsed={statsUsed}
					onTodoAction={onTodoAction}
				/>
				<Ressurect defeated={defeated} onTodoAction={onTodoAction} />
				<AttackBoss
					setCritChance={setCritChance}
					critChance={critChance}
					showAttack={showAttack}
					inMatch={inMatch}
					stats={waveList}
					bossStats={globalStates}
					walletInstalled={walletInstalled}
					walletConnected={walletConnected}
					isMumbai={isMumbai}
					onTodoAction={onTodoAction}
					loading={loading}
					writeLoading={writeLoading}
					totalWaves={totalWaves}
					sendWave={sendWave}
					sendCake={sendCake}
					sendHype={sendHype}
				/>
				<SendWave
					optedIn={optedIn}
					defeated={defeated}
					upgrade={upgrade}
					inMatch={inMatch}
					stats={waveList}
					bossStats={globalStates}
					walletInstalled={walletInstalled}
					walletConnected={walletConnected}
					isMumbai={isMumbai}
					onTodoAction={onTodoAction}
					loading={loading}
					writeLoading={writeLoading}
					totalWaves={totalWaves}
					sendWave={sendWave}
					sendCake={sendCake}
					sendHype={sendHype}
				/>
				{/* <WaveList onTodoAction={onTodoAction} waveList={waveList} /> */}
			</div>
		</div>
	);
}
