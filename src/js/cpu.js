import { DATA, tiles, figures } from "./script";
import { getPotentialFields, moveFigure } from "./potentialMoves";
import { getRandomInt } from "./helpers";

export const cpuTurn = () => {
	if(DATA.isEnd) return;

	if(!figures.filter(f => f.player === 2 && f.isAlive).length) {
		console.log("cestitam, pobedio si!");
	}


	DATA.isCpuTurn = true;
	setTimeout(() => {
		// select random char
		const possibleFigures = figures.filter(f => f.player === 2 && f.isAlive);
		const finalPicks = [];

		possibleFigures.forEach(f => {
			const pot = getPotentialFields(f);

			if(pot.length) {
				finalPicks.push({
					figure: f,
					moves: pot
				});
			}
		});

		if(!finalPicks.length) {
			console.log("cpu ne moze nista da odigra jbg");
			return;
		}

		const pick = finalPicks[getRandomInt(finalPicks.length - 1)];
		const pickedMove = pick.moves[getRandomInt(pick.moves.length - 1)];
		const tile = tiles.filter(t => t.coords === pickedMove)[0];

		moveFigure({
			tile,
			eat: tile.hasPlayer === 1,
			cpuFigure: pick.figure
		});


	}, 700);

	setTimeout(() => {
		console.log("cpu turn ended");
		DATA.isCpuTurn = false;
	}, 900);
};
