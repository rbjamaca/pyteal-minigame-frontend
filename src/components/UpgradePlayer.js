import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";

import "./SendWave.css";
import NumericInput from "react-numeric-input2";

export default function UpgradePlayer({
	upgrade,
	upgradeStats,
	setUpgradeStats,
	upgradePoints,
	statsUsed,
	onTodoAction
}) {

	if (!upgrade) return null

	return (
		<div className="boss-wrapper">
			<div className="how-to">
					<h3>
						You have levelled up!
					</h3>
			</div>
			<div className="how-to">
					<p>
						Points Remaining: <span className='stats-text'>{upgradePoints - (upgradeStats.attack + upgradeStats.defense + upgradeStats.health)}</span>
					</p>
			</div>
			<div className="form-container">
				<div className="form-group">
					<span className="form-label">Health: </span>
					<NumericInput min={0} max={(upgradePoints - (upgradeStats.attack + upgradeStats.defense))} disabled={statsUsed} value={upgradeStats.health} onChange={(e) => {
						if (statsUsed) return
						setUpgradeStats((_) => ({..._, health: e}))
					}} style={{
						wrap: {
							background: '#E2E2E2',
							boxShadow: '0 0 1px 1px #fff inset, 1px 1px 5px -1px #000',
							padding: '2px 2.26ex 2px 2px',
							borderRadius: '6px 3px 3px 6px',
							fontSize: '1em',
						},
						input: {
							borderRadius: '4px 2px 2px 4px',
							color: '#988869',
							padding: '0.1ex 1ex',
							border: '1px solid #ccc',
							marginRight: 4,
							display: 'block',
							fontWeight: 100,
							textShadow: `1px 1px 1px rgba(0, 0, 0, 0.1)`
						},
						'input:focus' : {
							border: '1px inset #69C',
							outline: 'none'
						},
						arrowUp: {
							borderBottomColor: 'rgba(66, 54, 0, 0.63)'
						},
						arrowDown: {
							borderTopColor: 'rgba(66, 54, 0, 0.63)'
						}
					}}
					/>
				</div>
				<div className="form-group">
					<span className="form-label">Attack: </span>
					<NumericInput min={0} max={(upgradePoints - (upgradeStats.health + upgradeStats.defense))} disabled={statsUsed} value={upgradeStats.attack} onClick={(e) => {
						console.log(e)
					}} 
					onChange={(e) => {
						if (statsUsed) return
						setUpgradeStats((_) => ({..._, attack: e}))
					}} style={{
						wrap: {
							background: '#E2E2E2',
							boxShadow: '0 0 1px 1px #fff inset, 1px 1px 5px -1px #000',
							padding: '2px 2.26ex 2px 2px',
							borderRadius: '6px 3px 3px 6px',
							fontSize: '1em',
						},
						input: {
							borderRadius: '4px 2px 2px 4px',
							color: '#988869',
							padding: '0.1ex 1ex',
							border: '1px solid #ccc',
							marginRight: 4,
							display: 'block',
							fontWeight: 100,
							textShadow: `1px 1px 1px rgba(0, 0, 0, 0.1)`
						},
						'input:focus' : {
							border: '1px inset #69C',
							outline: 'none'
						},
						arrowUp: {
							borderBottomColor: 'rgba(66, 54, 0, 0.63)'
						},
						arrowDown: {
							borderTopColor: 'rgba(66, 54, 0, 0.63)'
						}
					}}
					/>
				</div>
				<div className="form-group">
					<span className="form-label">Defense: </span>
					<NumericInput min={0} max={(upgradePoints - (upgradeStats.attack + upgradeStats.health))} disabled={statsUsed} value={upgradeStats.defense} onChange={(e) => {
						if (statsUsed) return
						setUpgradeStats((_) => ({..._, defense: e}))
					}} style={{
						wrap: {
							background: '#E2E2E2',
							boxShadow: '0 0 1px 1px #fff inset, 1px 1px 5px -1px #000',
							padding: '2px 2.26ex 2px 2px',
							borderRadius: '6px 3px 3px 6px',
							fontSize: '1em',
						},
						input: {
							borderRadius: '4px 2px 2px 4px',
							color: '#988869',
							padding: '0.1ex 1ex',
							border: '1px solid #ccc',
							marginRight: 4,
							display: 'block',
							fontWeight: 100,
							textShadow: `1px 1px 1px rgba(0, 0, 0, 0.1)`
						},
						'input:focus' : {
							border: '1px inset #69C',
							outline: 'none'
						},
						arrowUp: {
							borderBottomColor: 'rgba(66, 54, 0, 0.63)'
						},
						arrowDown: {
							borderTopColor: 'rgba(66, 54, 0, 0.63)'
						}
					}}
					/>
				</div>
				<section
				className={classNames("buttonGroup")}
				>
				<button className="button buttonWave" onClick={() => onTodoAction('upgrade_stats')}>
					<span className="buttonEmoji" role="img" aria-label="Wave">
						🧪
					</span>
					Upgrade Stats
				</button>
			</section>
			</div>
		</div>
	);
}
