import { tiles, scene, figures } from "./script";
import { generateId, FIGURE_TYPES, getCoordinates } from "./helpers";

const tileUrl = "models/tile-good.gltf";
const pawnUrl = "models/pawn.gltf";
const rookUrl = "models/rook.gltf";
const bishopUrl = "models/bishop.gltf";
const knightUrl = "models/knight.gltf";
const queenUrl = "models/queen.gltf";
const kingUrl = "models/king.gltf";

const addTile = (tileUrl, callback) => {
	BABYLON.SceneLoader.ImportMesh(null, tileUrl, "", scene, (meshes) => {
		meshes.map(m => {
			if(m.name.startsWith("Table.")) {

				const coords = getCoordinates(m.name.split(".")[1]);
				const [x, y] = coords.split("-");
				const id = generateId();
				m.id = id;

				const tileData = {
					id,
					hasPlayer: 0,
					coords,
					color: (x % 2 === 0 && y % 2 !== 0) || (y % 2 === 0 && x % 2 !== 0) ? "white" : "black"
				};

				tiles.push(tileData);
			}
		});
		callback();
	});
};

const addFigure = (figureUrl, table, isBlack, type) => {
	BABYLON.SceneLoader.ImportMesh(null, figureUrl, "", scene, (meshes) => {
		const tileObject = tiles.filter(t => t.coords === table)[0];
		const selectedTileId = tileObject.id;
		const tile = scene.getMeshByID(selectedTileId);
		const m = meshes[0];

		if(tile && m) {
			tileObject.hasPlayer = isBlack ? 2 : 1;

			m.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);

			const id = generateId();
			m.id = id;

			const figureData = {
				id,
				type,
				onTile: table,
				isAlive: true,
				player: isBlack ? 2 : 1,
			};

			if(type === FIGURE_TYPES.PAWN) {
				figureData.isInitialState = true;
			}

			figures.push(figureData);

			m.position.x = -tile.position.x;
			m.position.y = tile.position.y;
			m.position.z = tile.position.z;

			if(isBlack) {
				const mc = m.getChildren()[0];
				const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

				myMaterial.diffuseColor = new BABYLON.Color3(0.34, 0.27, 0.27);
				mc.material = myMaterial;
			}
		}
	});
};

export const loadModels = () => {
	addTile(tileUrl, () => {
		addFigure(rookUrl, "1-1", false, FIGURE_TYPES.ROOK);
		addFigure(knightUrl, "1-2", false, FIGURE_TYPES.KNIGHT);
		addFigure(bishopUrl, "1-3", false, FIGURE_TYPES.BISHOP);
		addFigure(queenUrl, "1-4", false, FIGURE_TYPES.QUEEN);
		addFigure(kingUrl, "1-5", false, FIGURE_TYPES.KING);
		addFigure(bishopUrl, "1-6", false, FIGURE_TYPES.BISHOP);
		addFigure(knightUrl, "1-7", false, FIGURE_TYPES.KNIGHT);
		addFigure(rookUrl, "1-8", false, FIGURE_TYPES.ROOK);

		addFigure(pawnUrl, "2-1", false, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "2-2", false, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "2-3", false, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "2-4", false, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "2-5", false, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "2-6", false, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "2-7", false, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "2-8", false, FIGURE_TYPES.PAWN);


		addFigure(pawnUrl, "7-1", true, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "7-2", true, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "7-3", true, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "7-4", true, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "7-5", true, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "7-6", true, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "7-7", true, FIGURE_TYPES.PAWN);
		addFigure(pawnUrl, "7-8", true, FIGURE_TYPES.PAWN);

		addFigure(rookUrl, "8-1", true, FIGURE_TYPES.ROOK);
		addFigure(knightUrl, "8-2", true, FIGURE_TYPES.KNIGHT);
		addFigure(bishopUrl, "8-3", true, FIGURE_TYPES.BISHOP);
		addFigure(queenUrl, "8-4", true, FIGURE_TYPES.QUEEN);
		addFigure(kingUrl, "8-5", true, FIGURE_TYPES.KING);
		addFigure(bishopUrl, "8-6", true, FIGURE_TYPES.BISHOP);
		addFigure(knightUrl, "8-7", true, FIGURE_TYPES.KNIGHT);
		addFigure(rookUrl, "8-8", true, FIGURE_TYPES.ROOK);
	});
};