import React, { useEffect, useState } from "react";
import classNames from "classnames";

import WaveStatus from "./WaveStatus";

import "./SendWave.css";
import { WriteStatus } from "../hooks/useWallet";

export default function SendWave({
	walletInstalled,
	walletConnected,
	loading,
	writeLoading,
	onTodoAction,
	bossStats,
	stats,
	inMatch,
	upgrade,
	defeated,
	optedIn
}) {
	const [message, setMessage] = useState("");
	const disableInput = Boolean(writeLoading);
	const disableButtons =
		!walletInstalled ||
		!walletConnected ||
		loading ||
		writeLoading ||
		message.length === 0;

	useEffect(() => {
		if (writeLoading === WriteStatus.None) {
			setMessage("");
		}
	}, [writeLoading]);

	const nanParser = (val) => {
		return isNaN(val) ? 0 : val
	}

	if (inMatch || upgrade || defeated || !walletConnected || !optedIn) return null

	return (
		<div className="boss-wrapper">
			<div className="bio">
			<h3>
				Boss Stats
			</h3>
			<div className="how-to">
					<p>
						Health: <span className='stats-text'>{nanParser(bossStats.find(_ => _.key === 'boss_health')?.value + (stats.find(_ => _.key === 'level')?.value * 30))}</span>
					</p>
					<p>
						Attack: <span className='stats-text'>{nanParser(bossStats.find(_ => _.key === 'boss_attack')?.value + (stats.find(_ => _.key === 'level')?.value * 5))}</span>
					</p>
					<p>
						Defense: <span className='stats-text'>{nanParser(bossStats.find(_ => _.key === 'boss_defense')?.value + (stats.find(_ => _.key === 'level')?.value * 5))}</span>
					</p>
			</div>
			</div>
			<section
				className={classNames("buttonGroup")}
			>
				<button className="button buttonWave" onClick={() => onTodoAction('fight_boss')}>
					<span className="buttonEmoji" role="img" aria-label="Wave">
						⚔
					</span>
					Fight Boss
				</button>
			</section>
			{/* <WaveStatus
				loading={loading}
				writeLoading={writeLoading}
				totalWaves={totalWaves}
			/> */}
		</div>
	);
}
