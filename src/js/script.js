import { deg } from "./helpers";
import { moveFigure, markAvailableTiles } from "./potentialMoves";
import { loadModels } from "./loaders";

export const DATA = {
	pickedFigure: null,
	isCpuTurn: false,
	availableFields: [],
	isEnd: false,
};

const frameRate = 10;

export const figures = [];
export const tiles = [];
export let scene = null;

export const animateFigure = (figure, newPosition) => {
	const p = scene.getMeshByID(figure.id);
	const t = scene.getMeshByID(newPosition.id);
	const xMove = new BABYLON.Animation("xMove", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	const zMove = new BABYLON.Animation("zMove", "position.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

	xMove.setKeys([
		{
			frame: 0,
			value: p.position.x
		}, {
			frame: 2 * frameRate,
			value: -t.position.x
		}
	]);

	zMove.setKeys([
		{
			frame: 0,
			value: p.position.z
		}, {
			frame: 2 * frameRate,
			value: t.position.z
		}
	]);

	scene.beginDirectAnimation(p, [xMove, zMove], 0, 2 * frameRate, false, 20);
};






const handleMyFigureClick = (figure) => {
	DATA.pickedFigure = figure;
	markAvailableTiles(figure);
};

const handleEnemyFigureClick = (figure) => {
	if(DATA.pickedFigure) {
		if(DATA.availableFields.indexOf(figure.onTile) > -1) {
			moveFigure({ tile: tiles.filter(t => t.coords === figure.onTile)[0], eat: true });
		} else {
			console.log("ne mozes pojesti ovo druze");
		}
	} else {
		console.log("ovo je neprijateljska figura, nemas nista sa tim");
	}
};

const basicSettings = () => {
	scene = new BABYLON.Scene(engine);
	const myAlpha = 90;
	const myBeta = 45;
	const myRadius = 32;

	const camera = new BABYLON.ArcRotateCamera(
		"camera1",
		deg(myAlpha),
		deg(myBeta),
		myRadius,
		new BABYLON.Vector3(0, 0, 0),
		scene
	);

	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, true);

	camera.lowerAlphaLimit = deg(myAlpha * 0.95);
	camera.upperAlphaLimit = deg(myAlpha * 1.05);
	camera.lowerBetaLimit = deg(myBeta * 0.95);
	camera.upperBetaLimit = deg(myBeta * 1.05);
	camera.lowerRadiusLimit = myRadius * 0.6;
	camera.upperRadiusLimit = myRadius * 1.4;

	const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), scene);

	light.intensity = 0.7;
};

const createScene = function() {
	basicSettings();

	loadModels();

	scene.onPointerDown = function(evt, pickResult) {
		if(DATA.isEnd) {
			console.log("kraj, nema dalje");
			return;
		}
		if(!pickResult.pickedMesh) return;

		if(DATA.isCpuTurn) {
			console.log("wait for it");
			return;
		}

		const mesh = pickResult.pickedMesh;
		const parent = mesh.parent;

		const potentialFigure = figures.filter(f => f.id === parent.id)[0];
		const potentialTile = tiles.filter(t => t.id === mesh.id)[0];

		if(potentialFigure) {
			if(!potentialFigure.isAlive) {
				console.log("umro ovaj");
			} else if(potentialFigure.player === 1) {
				handleMyFigureClick(potentialFigure);
			} else {
				handleEnemyFigureClick(potentialFigure);
			}
		} else if(potentialTile) {
			if(potentialTile.hasPlayer === 1) {
				handleMyFigureClick(figures.filter(f => f.onTile === potentialTile.coords)[0]);
			} else if(potentialTile.hasPlayer === 2) {
				console.log("kliknuo si na tile sa protivnickim igracem");
				handleEnemyFigureClick(figures.filter(f => f.onTile === potentialTile.coords)[0]);
			} else {
				if(DATA.availableFields.indexOf(potentialTile.coords) > -1) {
					moveFigure({ tile: potentialTile });
				} else {
					console.log("ne mozes ovde ici jbg");
				}
			}
		} else {
			console.log("gde si ovo kliknuo druze");
		}
	};


	return scene;
};

// export const logTable = () => {
// 	console.log(tiles.slice(0, 8).map(t => t.hasPlayer));
// 	console.log(tiles.slice(8, 16).map(t => t.hasPlayer));
// 	console.log(tiles.slice(16, 24).map(t => t.hasPlayer));
// 	console.log(tiles.slice(24, 32).map(t => t.hasPlayer));
// 	console.log(tiles.slice(32, 40).map(t => t.hasPlayer));
// 	console.log(tiles.slice(40, 48).map(t => t.hasPlayer));
// 	console.log(tiles.slice(48, 56).map(t => t.hasPlayer));
// 	console.log(tiles.slice(56, 64).map(t => t.hasPlayer));

// 	console.log("---");

// 	console.log("mine", figures.filter(f => f.player === 1 && f.isAlive).length);
// 	console.log("enemy", figures.filter(f => f.player === 2 && f.isAlive).length);
// 	console.log(figures);

// 	console.log("---");

// };

const canvas = document.querySelector("canvas");
const engine = new BABYLON.Engine(canvas, true, null, true);
const finalScene = createScene({ engine, canvas });

engine.runRenderLoop(() => {
	finalScene.render();
});
addEventListener("resize", () => { engine.resize(); });