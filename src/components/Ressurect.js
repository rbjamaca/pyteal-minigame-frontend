import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";

import "./SendWave.css";
import NumericInput from "react-numeric-input2";

export default function Ressurect({
	defeated,
	onTodoAction
}) {

	if (!defeated) return null

	return (
		<div className="boss-wrapper">
			<div className="how-to">
			<h3>
				You have been defeated
			</h3>
			</div>
				
			
				<section
				className={classNames("buttonGroup")}
				>
				<button className="button buttonWave" onClick={() => onTodoAction('reset_stats')}>
					<span className="buttonEmoji" role="img" aria-label="Wave">
						🔥
					</span>
					Ressurect
				</button>
			</section>
		</div>
	);
}
