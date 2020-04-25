import { tiles, scene } from "./script";

export function getRandomInt(max) {
	const min = 0;
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const deg = (deg) => BABYLON.Tools.ToRadians(deg);

export const getCoordinates = (number) => {
	number = +number;
	const v1 = Math.ceil(number / 8);
	const v2 = number - Math.floor(number / 8) * 8 || 8;

	return `${v1}-${v2}`;
};


export const FIGURE_TYPES = {
	PAWN: "pawn",
	KNIGHT: "knight",
	QUEEN: "queen",
	KING: "king",
	BISHOP: "bishop",
	ROOK: "rook"
};

export const setAllTilesVisibility = (value = 1) => {
	tiles.forEach(t => {
		const tile = scene.getMeshByID(t.id);

		tile.visibility = value;
	});
};

export const generateId = () => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = Math.random() * 16 | 0; // eslint-disable-line no-bitwise
		const v = c === "x" ? r : (r & 0x3 | 0x8); // eslint-disable-line no-bitwise
		return v.toString(16);
	});
};