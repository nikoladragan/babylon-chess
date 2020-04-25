import { tiles, figures, scene, animateFigure, DATA } from "./script";
import { FIGURE_TYPES, setAllTilesVisibility } from "./helpers";
import { cpuTurn } from "./cpu";

export const getPawnPotentialMoves = (figure, x, y) => {
	const isPlayer = figure.player === 1;
	const enemy = isPlayer ? 2 : 1;

	const potentialEatCoords1 = `${x + (isPlayer ? 1 : -1)}-${y - 1}`;
	const potentialEatCoords2 = `${x + (isPlayer ? 1 : -1)}-${y + 1}`;
	const potentialEatTile1 = tiles.filter(t => t.coords === potentialEatCoords1)[0];
	const potentialEatTile2 = tiles.filter(t => t.coords === potentialEatCoords2)[0];
	const isInitialState = figure.isInitialState;

	const potentialFields = [
		`${x + (isPlayer ? 1 : -1)}-${y}`
	];

	if(isInitialState) {
		potentialFields.push(`${x + (isPlayer ? 2 : -2)}-${y}`);
	}

	const filteredFields = potentialFields.filter(f => {
		const tile = tiles.filter(t => t.coords === f)[0];

		if(tile && !tile.hasPlayer) {
			return f;
		}
	});

	if(potentialEatTile1 && potentialEatTile1.hasPlayer === enemy) {
		filteredFields.push(potentialEatCoords1);
	}

	if(potentialEatTile2 && potentialEatTile2.hasPlayer === enemy) {
		filteredFields.push(potentialEatCoords2);
	}

	return filteredFields;
};

export const getKnightPotentialMoves = (figure, x, y) => {
	const enemy = figure.player === 1 ? 2 : 1;

	const potentialFields = [
		`${x + 1}-${y - 2}`,
		`${x + 2}-${y - 1}`,
		`${x + 2}-${y + 1}`,
		`${x + 1}-${y + 2}`,
		`${x - 1}-${y + 2}`,
		`${x - 2}-${y + 1}`,
		`${x - 2}-${y - 1}`,
		`${x - 1}-${y - 2}`,
	];

	const filteredFields = potentialFields.filter(f => {
		const tile = tiles.filter(t => t.coords === f)[0];

		if(tile && (!tile.hasPlayer || tile.hasPlayer === enemy)) {
			return f;
		}
	});

	return filteredFields;
};

export const getRookPontetialMoves = (figure, x, y) => {
	const potentialFields = [];
	const mine = figure.player === 1 ? 1 : 2;
	const enemy = figure.player === 2 ? 1 : 2;

	for(let i = x + 1; i <= 8; i++) {
		const coords = `${i}-${y}`;
		const tile = tiles.filter(t => t.coords === coords)[0];

		if(tile.hasPlayer === mine) break;
		potentialFields.push(`${i}-${y}`);
		if(tile.hasPlayer === enemy) break;
	}

	for(let i = y + 1; i <= 8; i++) {
		const coords = `${x}-${i}`;
		const tile = tiles.filter(t => t.coords === coords)[0];

		if(tile.hasPlayer === mine) break;
		potentialFields.push(`${x}-${i}`);
		if(tile.hasPlayer === enemy) break;
	}

	for(let i = x - 1; i >= 1; i--) {
		const coords = `${i}-${y}`;
		const tile = tiles.filter(t => t.coords === coords)[0];

		if(tile.hasPlayer === mine) break;
		potentialFields.push(`${i}-${y}`);
		if(tile.hasPlayer === enemy) break;
	}

	for(let i = y - 1; i >= 1; i--) {
		const coords = `${x}-${i}`;
		const tile = tiles.filter(t => t.coords === coords)[0];

		if(tile.hasPlayer === mine) break;
		potentialFields.push(`${x}-${i}`);
		if(tile.hasPlayer === enemy) break;
	}

	return potentialFields;
};

export const getBishopPotentialMoves = (figure, x, y) => {
	const originalX = x;
	const originalY = y;
	const potentialFields = [];
	const mine = figure.player === 1 ? 1 : 2;
	const enemy = figure.player === 2 ? 1 : 2;

	while(x < 8 && y < 8) {
		x++;
		y++;
		const coords = `${x}-${y}`;
		const tile = tiles.filter(t => t.coords === coords)[0];

		if(tile.hasPlayer === mine) break;
		potentialFields.push(`${x}-${y}`);
		if(tile.hasPlayer === enemy) break;
	}

	x = originalX;
	y = originalY;

	while(x > 1 && y > 1) {
		x--;
		y--;

		const coords = `${x}-${y}`;
		const tile = tiles.filter(t => t.coords === coords)[0];

		if(tile.hasPlayer === mine) break;
		potentialFields.push(`${x}-${y}`);
		if(tile.hasPlayer === enemy) break;
	}

	x = originalX;
	y = originalY;

	while(x < 8 && y > 1) {
		x++;
		y--;
		const coords = `${x}-${y}`;
		const tile = tiles.filter(t => t.coords === coords)[0];

		if(tile.hasPlayer === mine) break;
		potentialFields.push(`${x}-${y}`);
		if(tile.hasPlayer === enemy) break;
	}

	x = originalX;
	y = originalY;

	while(x > 1 && y < 8) {
		x--;
		y++;
		const coords = `${x}-${y}`;
		const tile = tiles.filter(t => t.coords === coords)[0];

		if(tile.hasPlayer === mine) break;
		potentialFields.push(`${x}-${y}`);
		if(tile.hasPlayer === enemy) break;
	}

	return potentialFields;
};

export const getQueenPotentialMoves = (figure, x, y) => {
	const moves1 = getRookPontetialMoves(figure, x, y);
	const moves2 = getBishopPotentialMoves(figure, x, y);

	return [...moves1, ... moves2];
};

export const getKingPotentialMoves = (figure, x, y) => {
	const isPlayer = figure.player === 1;

	const potentialFields = [
		`${x + 1}-${y + 1}`,
		`${x + 1}-${y - 1}`,
		`${x + 1}-${y}`,
		`${x - 1}-${y + 1}`,
		`${x - 1}-${y - 1}`,
		`${x - 1}-${y}`,
		`${x}-${y + 1}`,
		`${x}-${y - 1}`,
	];

	const filteredFields = potentialFields.filter(f => {
		const tile = tiles.filter(t => t.coords === f)[0];

		if(tile && tile.hasPlayer !== (isPlayer ? 1 : 2)) {
			return f;
		}
	});

	return filteredFields;
};

export const eatFigure = (tile) => {
	const enemy = figures.filter(f => f.onTile === tile.coords)[0];
	const figure = scene.getMeshByID(enemy.id);

	if(enemy.type === FIGURE_TYPES.KING) {
		DATA.isEnd = true;
	}

	enemy.isAlive = false;
	enemy.onTile = "";
	figure.position.x = -50000;
};

export const moveFigure = ({ tile, eat, cpuFigure }) => {
	const figure = cpuFigure || DATA.pickedFigure;
	const oldTile = tiles.filter(t => t.coords === figure.onTile)[0];

	if(figure.isInitialState && figure.type === FIGURE_TYPES.PAWN) {
		figure.isInitialState = false;
	}

	if(eat) {
		eatFigure(tile);
	}

	oldTile.hasPlayer = 0;
	figure.onTile = tile.coords;
	tile.hasPlayer = cpuFigure ? 2 : 1;

	animateFigure(figure, tile);

	setAllTilesVisibility(1);

	console.log((cpuFigure ? "cpu" : "player"), "moves", figure.type, "to", tile.coords, (eat ? "and will eat" : ""));

	DATA.pickedFigure = null;
	DATA.availableFields = [];

	if(!cpuFigure) cpuTurn();
};



export const markAvailableTiles = (figure) => {
	DATA.availableFields = [];

	const mark = (coords) => {
		setAllTilesVisibility(0.4);

		coords.forEach(c => {
			const filteredTile = tiles.filter(t => t.coords === c)[0];
			if(!filteredTile) return;

			const t = scene.getMeshByID(filteredTile.id);
			t.visibility = 1;
			DATA.availableFields.push(c);
		});
	};

	const potentialFields = getPotentialFields(figure);

	if(potentialFields.length) mark(potentialFields);
};

export const getPotentialFields = (figure) => {
	const tile = figure.onTile;
	const type = figure.type;

	const [x, y] = tile.split("-").map(x => parseInt(x));
	const potentialFields = (() => {
		switch(type) {
			case FIGURE_TYPES.KNIGHT:
				return getKnightPotentialMoves(figure, x, y);
			case FIGURE_TYPES.PAWN:
				return getPawnPotentialMoves(figure, x, y);
			case FIGURE_TYPES.ROOK:
				return getRookPontetialMoves(figure, x, y);
			case FIGURE_TYPES.BISHOP:
				return getBishopPotentialMoves(figure, x, y);
			case FIGURE_TYPES.QUEEN:
				return getQueenPotentialMoves(figure, x, y);
			case FIGURE_TYPES.KING:
				return getKingPotentialMoves(figure, x, y);
			default:
				return null;
		}
	})();

	if(potentialFields.length) {
		return potentialFields;
	} else {
		// console.log("ne moze ovaj nista");
		return [];
	}
};