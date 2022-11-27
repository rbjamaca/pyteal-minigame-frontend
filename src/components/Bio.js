import React from "react";

export default function Bio({stats, optedIn, walletConnected}) {

	if (!walletConnected) {
		return (
			<div className="bio">
				<h3>
					Please connect your wallet first.
				</h3>
			</div>
		);
	}

	if (!optedIn) {
		return (
			<div className="bio">
				<h3>
					Register to play.
				</h3>
			</div>
		);
	}

	return (
		<div className="bio">
			<h3>
				Hero Stats
			</h3>
			<div className="how-to">
					<p>
						Level: <span className='stats-text'>{stats.find(_ => _.key === 'level')?.value}</span>
					</p>
					<p>
						Health: <span className='stats-text'>{stats.find(_ => _.key === 'health')?.value}</span>
					</p>
					<p>
						Attack: <span className='stats-text'>{stats.find(_ => _.key === 'attack')?.value}</span>
					</p>
					<p>
						Defense: <span className='stats-text'>{stats.find(_ => _.key === 'defense')?.value}</span>
					</p>
			</div>
		</div>
	);
}
