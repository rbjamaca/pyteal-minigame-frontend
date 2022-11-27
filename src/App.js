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
		setCritChance
	} = useWallet(peraWallet);

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
				<Bio stats={waveList} />
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
