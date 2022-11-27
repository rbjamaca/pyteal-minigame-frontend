import React, { useEffect, useState } from "react";
import classNames from "classnames";

import WaveStatus from "./WaveStatus";

import "./SendWave.css";
import { WriteStatus } from "../hooks/useWallet";
import ProgressBar from "@ramonak/react-progress-bar";
import Monster from '../assets/monster-flipped.gif';
import Warrior from '../assets/warrior.gif';
import Attack from '../assets/attack.gif';
import { RadioButton, RadioGroup, ReversedRadioButton } from "react-radio-buttons";

export default function AttackBoss({
	walletInstalled,
	walletConnected,
	isMumbai,
	loading,
	writeLoading,
	totalWaves,
	sendWave,
	sendCake,
	sendHype,
	onTodoAction,
	bossStats,
	stats,
	inMatch,
	showAttack,
	critChance,
	setCritChance
}) {
	const [message, setMessage] = useState("");
	const disableInput = Boolean(writeLoading);
	const disableButtons = critChance === null

	useEffect(() => {
		if (writeLoading === WriteStatus.None) {
			setMessage("");
		}
	}, [writeLoading]);

	const nanParser = (val) => {
		return isNaN(val) ? 0 : val
	}

	if (!inMatch) return null

	return (
		<div className="boss-wrapper">
			<div className="bio">
			<h3>
				Battle
			</h3>
			<div className="how-to">
					<div className="hp-wrapper">
					<p>
						Hero HP:
					</p>
					<ProgressBar completed={`${nanParser(stats.find(_ => _.key === 'hp')?.value)}`} maxCompleted={nanParser(stats.find(_ => _.key === 'health')?.value)} 
						className="health-bar-wrapper"
						barContainerClassName="health-bar-container"
						// completedClassName="barCompleted"
						labelClassName="bar-label"
						bgColor="linear-gradient(to right, rgb(0 241 70 / 85%), rgb(0 236 137 / 80%))"
					/>
					<img src={Warrior} width={'90%'} />
					{showAttack && <img src={Attack} style={{marginTop: -260}} width={'90%'} />}
					</div>
					<div className="hp-wrapper">
					<p>
						Boss HP:
					</p>
					<ProgressBar completed={`${nanParser(stats.find(_ => _.key === 'local_boss_hp')?.value)}`} maxCompleted={nanParser(stats.find(_ => _.key === 'local_boss_health')?.value)} 
						className="health-bar-wrapper"
						barContainerClassName="health-bar-container"
						// completedClassName="barCompleted"
						labelClassName="bar-label"
						bgColor="linear-gradient(to right, rgb(0 241 70 / 85%), rgb(0 236 137 / 80%))"
					/>
					<img src={Monster} width={'90%'} />
					{showAttack && <img src={Attack} style={{marginTop: -225}} width={'90%'} />}
					</div>
			</div>
			</div>
			<p style={{textAlign: 'center'}}>
				Select type of attack:
			</p>
			<RadioGroup onChange={(e) => setCritChance(parseInt(e))} horizontal>
			<RadioButton value="1">
				🔥
			</RadioButton>
			<RadioButton value="2">
				💧
			</RadioButton>
			<RadioButton value="3">
				🌪
			</RadioButton>
			<RadioButton value="4">
				🪨
			</RadioButton>
			</RadioGroup>
			<section
				className={classNames("buttonGroup", disableButtons && "disabled")}
			>
				<button className="button buttonWave" onClick={() => onTodoAction('attack_boss')}>
					<span className="buttonEmoji" role="img" aria-label="Wave">
						⚔
					</span>
					Attack Boss
				</button>
			</section>
		</div>
	);
}
