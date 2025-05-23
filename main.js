 		var newGameButton = document.getElementById("newgame");
 		var loadGameButton = document.getElementById("loadgame");
 		var titleScreenSaveButton = document.getElementById("titlescreensave");

 		var pictureCount = 0;
 		timeIntervalPictureChange = 5000;
 		window.setInterval(function(){
 			if(pictureCount == document.getElementsByClassName("titleScreen").length){
 				pictureCount = 0;
 			}
 			var pictures = document.getElementsByClassName("titleScreen");
 			for(var i = 0; i < pictures.length; i++){
 				pictures[i].style.zIndex = -5;
 			}
 			pictures[pictureCount].style.zIndex = -4;
 			pictureCount++;
 		}, timeIntervalPictureChange);

 		newGameButton.addEventListener("click", function(){
 			game("new");
		});

 		var inputFile = document.getElementById("inputFile");
		loadGameButton.addEventListener("click", function(){
 			inputFile.style.display = "block";
		});

		var loadedData;
		inputFile.addEventListener("change", function(){
			loadedData = inputFile.files[0];

			const reader = new FileReader();
			reader.onload = logFile;
			reader.readAsText(loadedData);
		});
		function logFile(event){
			let str = event.target.result;
			let json = JSON.parse(str);
			loadedData = json;
			game("load");
		}

 		function game(newOrLoad){

 			var worldGen = Math.random();
	 		var biomeGen = Math.random();
	 		var treesGen = Math.random();

	 		var chunks = [];
			var xoff = 0;
			var zoff = 0;
			var inc = 0.05;
			var amplitude = 30
			var renderDistance = 5;
			var chunkSize = 5;
			var depth = 10; // keeps track of the depth of the world (in terms of blocks)
			var minWorldY = -250; // the minimum y coordinate of a block
			var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
			camera.position.x = renderDistance * chunkSize / 2 * 5;
			camera.position.z = renderDistance * chunkSize / 2 * 5;
			camera.position.y = 50;

			var placedBlocks = [];
			var brokenBlocks = [];

 			if(newOrLoad == "load"){
 				worldGen = loadedData.seeds.world;
				biomeGen = loadedData.seeds.biome;
				treesGen = loadedData.seeds.trees;

				camera.position.x = loadedData.cameraPosition.x;
				camera.position.y = loadedData.cameraPosition.y;
				camera.position.z = loadedData.cameraPosition.z;

				camera.rotation.x = loadedData.playerRotation.x;
				camera.rotation.y = loadedData.playerRotation.y;
				camera.rotation.z = loadedData.playerRotation.z;

				placedBlocks = loadedData.editedBlocks.placed;
				brokenBlocks = loadedData.editedBlocks.destroyed;
				console.log(placedBlocks, brokenBlocks);
 			}

 			timeIntervalPictureChange = Infinity;
 			// GUI removal and additions
 			document.getElementById("titleScreenGUI").style.display = "none";
 			document.getElementById("gameScreenGUI").style.display = "block";

	 		// Hotbar
	 		for(var i = 0; i < document.getElementsByClassName("hotbar").length; i++){
	 			document.getElementsByClassName("hotbar")[i].style.height = (0.05 * window.innerWidth).toString();
	 		}
	 		var hotbar = ["cobblestone", "dirt", "grass", "oakLeaves", "oakLog", "sand", "glass", "brick", "plank"];

	 		// Cursor
	 		var cursor = document.getElementById("cursor");
	 		cursor.style.left = ((0.5 * window.innerWidth) - (0.5 * cursor.width)).toString() + "px";
	 		cursor.style.top = ((0.5 * window.innerHeight) - (0.5 * cursor.height)).toString() + "px";

	 		// Performance Stats
	 		var stats = new Stats();
	 		stats.showPanel(0); // 0:fps, 1:ms, 2:mb, 3+:custom
	 		document.body.appendChild(stats.dom);

	 		function animate(){
	 			stats.begin();

	 			// monitored code goes between this called functions

	 			stats.end();

	 			requestAnimationFrame(animate);

	 			if(camera.position.y<minWorldY){
	 				camera.position.y=-minWorldY
	 				ySpeed=0
	 			}
	 		}

	 		requestAnimationFrame(animate);

	 		function saveWorld(){
	 			/*
					THINGS TO BE SAVED:
					- Seed for world, biome and trees
					- camera/player x, y, z coords
					- Player camera rotation
					- Placed blocks
					- Destroyed blocks
	 			*/
	 			var dataToSave = {
	 				seeds : {
	 					world : worldGen,
	 					biome : biomeGen,
	 					trees : treesGen
	 				},
	 				cameraPosition : {
	 					x : camera.position.x,
	 					y : camera.position.y,
	 					z : camera.position.z
	 				},
	 				playerRotation : {
	 					x : camera.rotation.x,
	 					y : camera.rotation.y,
	 					z : camera.rotation.z
	 				},
	 				editedBlocks : {
	 					placed : placedBlocks,
	 					destroyed : brokenBlocks
	 				}
	 			};
				let blob = new Blob(
					[JSON.stringify(dataToSave)], 
					{type: 'application/json'}
				);
				saveAs(blob, 'save.json');
 			}

	 		titleScreenSaveButton.addEventListener("click", function(){
	 			saveWorld();
	 			window.location.reload();
	 			// saveWorld(); TO BE MADE IN THE NEXT PART!
	 		});

	 		var scene = new THREE.Scene();
	 		scene.background = new THREE.Color(0x00ffff);
	 		scene.fog = new THREE.Fog(0x00ffff, 10, 650);
			var renderer = new THREE.WebGLRenderer();
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);

			/*
			var groundBox = new THREE.BoxBufferGeometry(25, 1, 50);
			var groundMesh = new THREE.MeshBasicMaterial({color : 0x00ff00});
			var ground = new THREE.Mesh(groundBox, groundMesh);
			scene.add(ground);
			ground.position.y = -5;

			// Creating the border lines for ground
			var edges = new THREE.EdgesGeometry(groundBox);
			var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color : 0x000000}));
			scene.add(line);
			line.position.y = -5;
			*/

			var faces = [
				{ // left
				    dir: [ -5,  0,  0, "left"],
				},
				{ // right
				    dir: [  5,  0,  0, "right"],
				},
				{ // bottom
				    dir: [  0, -5,  0, "bottom"],
				},
				{ // top
				    dir: [  0,  5,  0, "top"],
				},
				{ // back
				    dir: [  0,  0, -5, "back"],
				},
				{ // front
				    dir: [  0,  0,  5, "front"],
				},
			];

			function Block(x, y, z, placed, blockType){
				this.x = x;
				this.y = y;
				this.z = z;
				this.placed = placed;
				this.blockType = blockType;
			}

			// var axesHelper = new THREE.AxesHelper( 5 );
			// scene.add( axesHelper );

			/*
			var blocks = [];
			var xoff = 0;
			var zoff = 0;
			var inc = 0.05;
			var amplitude = 50;
			for(var x = 0; x < 20; x++){
				xoff = 0;
				for(var z = 0; z < 20; z++){
					var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
					blocks.push(new Block(x * 5, v, z * 5));
					xoff = xoff + inc;
				}
				zoff = zoff + inc;
			}
			*/

			var loader = new THREE.TextureLoader();
			
			/*
			var materialArray = [
				new THREE.MeshBasicMaterial({map : loader.load("texture/texture.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/texture.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/texture.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/texture.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/texture.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/texture.png")}),
			];
			*/

			var blockBox = new THREE.BoxGeometry(5, 5, 5);
			var grassTexture = [
				new THREE.MeshBasicMaterial({map : loader.load("texture/grass/side.jpg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/grass/side.jpg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/grass/top.jpg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/grass/bottom.jpg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/grass/side.jpg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/grass/side.jpg")})
			];
			var dirtTexture = [
				new THREE.MeshBasicMaterial({map : loader.load("texture/dirt/dirt.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/dirt/dirt.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/dirt/dirt.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/dirt/dirt.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/dirt/dirt.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/dirt/dirt.png")})
			];
			var cobblestoneTexture = [
				new THREE.MeshBasicMaterial({map : loader.load("texture/cobblestone/cobblestone.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/cobblestone/cobblestone.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/cobblestone/cobblestone.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/cobblestone/cobblestone.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/cobblestone/cobblestone.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/cobblestone/cobblestone.png")})
			];
			var oakLogTexture = [
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLog/side.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLog/side.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLog/top.jpg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLog/bottom.jpg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLog/side.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLog/side.png")})
			];
			var oakLeavesTexture = [
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLeaves/oakLeaves.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLeaves/oakLeaves.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLeaves/oakLeaves.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLeaves/oakLeaves.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLeaves/oakLeaves.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/oakLeaves/oakLeaves.png")})
			];
			var sandTexture = [
				new THREE.MeshBasicMaterial({map : loader.load("texture/sand/sand.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/sand/sand.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/sand/sand.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/sand/sand.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/sand/sand.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/sand/sand.png")})
			];
			var waterTexture = [
				new THREE.MeshBasicMaterial({map : loader.load("texture/water/water.jpeg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/water/water.jpeg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/water/water.jpeg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/water/water.jpeg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/water/water.jpeg")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/water/water.jpeg")})
			];
			var glassTexture = [
				new THREE.MeshBasicMaterial({map : loader.load("texture/glass/glass.png"),transparent:true,opacity:0.5}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/glass/glass.png"),transparent:true,opacity:0.5}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/glass/glass.png"),transparent:true,opacity:0.5}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/glass/glass.png"),transparent:true,opacity:0.5}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/glass/glass.png"),transparent:true,opacity:0.5}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/glass/glass.png"),transparent:true,opacity:0.5})
			];
			var brickTexture = [
				new THREE.MeshBasicMaterial({map : loader.load("texture/brick/brick.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/brick/brick.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/brick/brick.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/brick/brick.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/brick/brick.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/brick/brick.png")})
			];
			var plankTexture = [
				new THREE.MeshBasicMaterial({map : loader.load("texture/plank/plank.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/plank/plank.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/plank/plank.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/plank/plank.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/plank/plank.png")}),
				new THREE.MeshBasicMaterial({map : loader.load("texture/plank/plank.png")})
			];

			var blocks = [
				{name : "grass", materialArray : grassTexture, mesh : new THREE.InstancedMesh(blockBox, grassTexture, renderDistance * renderDistance * chunkSize * chunkSize * depth), count : 0, range : [0], biomes : ["plains"]},
				{name : "dirt", materialArray : dirtTexture, mesh : new THREE.InstancedMesh(blockBox, dirtTexture, renderDistance * renderDistance * chunkSize * chunkSize * depth), count : 0, range : [1, 2], biomes : ["plains"]},
				{name : "cobblestone", materialArray : cobblestoneTexture, mesh : new THREE.InstancedMesh(blockBox, cobblestoneTexture, renderDistance * renderDistance * chunkSize * chunkSize * depth), count : 0, range : [3, 4, 5, 6, 7, 8, 9, 10], biomes : ["plains", "desert"]},
				{name : "oakLog", materialArray : oakLogTexture, mesh : new THREE.InstancedMesh(blockBox, oakLogTexture, renderDistance * renderDistance * chunkSize * chunkSize * depth), count : 0, range : [], biomes : ["plains"]},
				{name : "oakLeaves", materialArray : oakLeavesTexture, mesh : new THREE.InstancedMesh(blockBox, oakLeavesTexture, renderDistance * renderDistance * chunkSize * chunkSize * depth), count : 0, range : [], biomes : ["plains"]},
				{name : "sand", materialArray : sandTexture, mesh : new THREE.InstancedMesh(blockBox, sandTexture, renderDistance * renderDistance * chunkSize * chunkSize * depth), count : 0, range : [0, 1, 2], biomes : ["desert"]},
				{name : "water", materialArray : waterTexture, mesh : new THREE.InstancedMesh(blockBox, waterTexture, renderDistance * renderDistance * chunkSize * chunkSize * depth), count : 0, range : [], biomes : ["plains", "desert"]},
				{name : "glass", materialArray : glassTexture, mesh : new THREE.InstancedMesh(blockBox, glassTexture, renderDistance * renderDistance * chunkSize * chunkSize * depth), count : 0, range : [], biomes : ["plains", "desert"]},
				{name : "brick", materialArray : brickTexture, mesh : new THREE.InstancedMesh(blockBox, brickTexture, renderDistance * renderDistance * chunkSize * chunkSize * depth), count : 0, range : [], biomes : ["plains", "desert"]},
				{name : "plank", materialArray : plankTexture, mesh : new THREE.InstancedMesh(blockBox, plankTexture, renderDistance * renderDistance * chunkSize * chunkSize * depth), count : 0, range : [], biomes : ["plains", "desert"]},
			];
			var blockTypes = ["grass", "dirt", "cobblestone", "oakLog", "oakLeaves", "sand", "water", "glass", "brick", "plank"];
			var biomeSize = 100; // the higher this number, the larger the biomes get
			var treeDensity = 1; 
			function getBiome(n){
				if(n < 0.2){
					return "plains";
				} else if(n >= 0.2){
					return "desert";
				}
			}

			var oakLogIndex = blockTypes.indexOf("oakLog");
			var oakLeavesIndex = blockTypes.indexOf("oakLeaves");
			var waterIndex = blockTypes.indexOf("water");
			var glassIndex = blockTypes.indexOf("glass");
			var waterLevel = 0;

			// Setting Opacity of water
			for(var i = 0; i < waterTexture.length; i++){
				if(i == 2 || i == 3){ // top and bottom
					blocks[waterIndex].materialArray[i].transparent = true;
					blocks[waterIndex].materialArray[i].opacity = 0.7;
				} else { // sides
					blocks[waterIndex].materialArray[i].transparent = true;
					blocks[waterIndex].materialArray[i].opacity = 0.4;
				}
			}
			// Making glass transparent
			for(var i = 0; i < glassTexture.length; i++){
				blocks[glassIndex].materialArray[i].transparent = true;
			}

			for(var i = 0; i < renderDistance; i++){
				for(j = 0; j < renderDistance; j++){
					var chunk = [];
					for(var x = i * chunkSize; x < (i * chunkSize) + chunkSize; x++){
						for(var z = j * chunkSize; z < (j * chunkSize) + chunkSize; z++){
							xoff = inc * x;
							zoff = inc * z;
							noise.seed(worldGen);
							var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
							noise.seed(biomeGen);
							var biome = getBiome(noise.perlin2(xoff / biomeSize, zoff / biomeSize));
							noise.seed(treesGen);
							var treeNoise = noise.perlin2(xoff / treeDensity, zoff / treeDensity);
							var canPutLeaf = false;
							for(var xInc = -1; xInc < 2; xInc += 1){
								for(var zInc = -1; zInc < 2; zInc += 1){
									if(xInc == 0 && zInc == 0){
										continue;
									}
									var xoffAround = inc * (x + xInc);
									var zoffAround = inc * (z + zInc);
									var treeNoiseAround = noise.perlin2(xoffAround / treeDensity, zoffAround / treeDensity);
									if(parseFloat(treeNoiseAround.toFixed(3)) == 0.001){
										canPutLeaf = true;
										break;
									}
								}
							}

							var waterExistsHere = false;
							var h = 5;
							while(true){
								var brokenWaterBlock = false;
								for(var d = 0; d < brokenBlocks.length; d++){
									if(brokenBlocks[d].x == x * 5 && brokenBlocks[d].y == v + h && brokenBlocks[d].z == z * 5){
										brokenWaterBlock = true;
										break;
									}
								}
								if(v + h <= waterLevel && brokenWaterBlock == false){
									let matrix = new THREE.Matrix4().makeTranslation(
										x * 5,
										v + h,
										z * 5
									);
									blocks[waterIndex].mesh.setMatrixAt(blocks[waterIndex].count, matrix);
									blocks[waterIndex].count++;
									chunk.push(new Block(x * 5, v + h, z * 5, false, blocks[waterIndex].name));
									h += 5;
									waterExistsHere = true;
								} else {
									break;
								}
							}

							for(var d = -8; d < depth; d++){
								// Try to find a broken block in that position
								var blockIsDestroyed = false;
								for(var a = 0; a < brokenBlocks.length; a++){
									if(brokenBlocks[a].x == x * 5 && brokenBlocks[a].y == v - (d * 5) && brokenBlocks[a].z == z * 5){
										blockIsDestroyed = true;
										break;
									}
								}
								if(!blockIsDestroyed){
									if(d >= 0){
										if(v - (d * 5) < minWorldY){
											continue;
										}
										let matrix = new THREE.Matrix4().makeTranslation(
											x * 5,
											v - (d * 5),
											z * 5
										);
										for(var b = 0; b < blocks.length; b++){
											if(blocks[b].range.includes(d) && blocks[b].biomes.includes(biome)){
												blocks[b].mesh.setMatrixAt(blocks[b].count, matrix);
												blocks[b].count++;
												chunk.push(new Block(x * 5, v - (d * 5), z * 5, false, blocks[b].name));
											}
										}
									} else {
										// TREES!
										if(biome == "plains" && waterExistsHere == false){
											// LOGS
											if(parseFloat(treeNoise.toFixed(3)) == 0.001){
												if(d < 0 && d >= -8){
													let logMatrix = new THREE.Matrix4().makeTranslation(
														x * 5,
														v - (d * 5),
														z * 5
													);
													if(d != -8){
														blocks[oakLogIndex].mesh.setMatrixAt(blocks[oakLogIndex].count, logMatrix);
														blocks[oakLogIndex].count++;
														chunk.push(new Block(x * 5, v - (d * 5), z * 5, false, blocks[oakLogIndex].name));
													} else { // TOP LEAf
														blocks[oakLeavesIndex].mesh.setMatrixAt(blocks[oakLeavesIndex].count, logMatrix);
														blocks[oakLeavesIndex].count++;
														chunk.push(new Block(x * 5, v - (d * 5), z * 5, false, blocks[oakLeavesIndex].name));
													}
												}
											}
											// LEAVES
											if(d <= -6 && canPutLeaf){
												if(parseFloat(treeNoise.toFixed(3)) != 0.001){
													let leafMatrix = new THREE.Matrix4().makeTranslation(
														x * 5,
														v - (d * 5),
														z * 5
													);
													blocks[oakLeavesIndex].mesh.setMatrixAt(blocks[oakLeavesIndex].count, leafMatrix);
													blocks[oakLeavesIndex].count++;
													chunk.push(new Block(x * 5, v - (d * 5), z * 5, false, blocks[oakLeavesIndex].name));
												}
											}
										}
									}
								}
							}
							for(var b = 0; b < placedBlocks.length; b++){
								if(placedBlocks[b].x == x * 5 && placedBlocks[b].z == z * 5){
									var ind = blockTypes.indexOf(placedBlocks[b].blockType);
									let placedBlocksMatrix = new THREE.Matrix4().makeTranslation(
										placedBlocks[b].x,
										placedBlocks[b].y,
										placedBlocks[b].z
									);
									blocks[ind].mesh.setMatrixAt(blocks[ind].count, placedBlocksMatrix);
									blocks[ind].count++;
									chunk.push(new Block(placedBlocks[b].x, placedBlocks[b].y, placedBlocks[b].z, true, placedBlocks[b].blockType));
									console.log(1);
								}
							}
						}
					}
					chunks.push(chunk);
				}
			}

			for(var i = 0; i < blocks.length; i++){
				scene.add(blocks[i].mesh)
			}

			var keys = [];
			var canJump = true;
			var controlOptions = {
				forward : "w",
				backward : "s",
				right : "d",
				left : "a",
				jump : " ", // " " = space
				placeBlock : "q" 
			};

			var chunkMap = [];
			for(var x = 0; x < renderDistance; x++){
				for(var z = 0; z < renderDistance; z++){
					chunkMap.push({x : x, z : z});
				}
			}

			function identifyChunk(x, z){
				var lowestX = lowestXBlock();
				var lowestZ = lowestZBlock();
				var difX = x - lowestX;
				var difZ = z - lowestZ;
				var divX = Math.floor(difX / (chunkSize * 5));
				var divZ = Math.floor(difZ / (chunkSize * 5));
				var index = undefined;
				for(var i = 0; i < chunkMap.length; i++){
					if(chunkMap[i].x == divX && chunkMap[i].z == divZ){
						index = i;
						break;
					}
				}
				return index; // Identified the chunks!!!
			}

			var start = 0;
			var sprint = false;
			var slot = 1;
			var blockToBePlaced = hotbar[slot - 1];
			for(var i = 1; i <= 9; i++){
		    	document.getElementsByClassName("hotbar")[i - 1].style.opacity = "0.8";
		    	document.getElementsByClassName("hotbar")[i - 1].style.border = "1px solid white";
		    	document.getElementsByClassName("hotbar")[i - 1].style.zIndex = "0";
		    	if(slot == i.toString()){
		    		document.getElementsByClassName("hotbar")[i - 1].style.opacity = "1";
		    		document.getElementsByClassName("hotbar")[i - 1].style.border = "2px solid black";
		    		document.getElementsByClassName("hotbar")[i - 1].style.zIndex = "1";
		    	}
		    }
			document.addEventListener("keydown", function(e){
				if(e.key == "w") {
			        var elapsed = new Date().getTime();
			        if(elapsed - start <= 300){
			        	sprint = true;
			        }
			        start = elapsed;
			    }

			    // Selecting a slot
			    if(["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)){
				    for(var i = 1; i <= 9; i++){
				    	document.getElementsByClassName("hotbar")[i - 1].style.opacity = "0.8";
				    	document.getElementsByClassName("hotbar")[i - 1].style.border = "1px solid white";
				    	document.getElementsByClassName("hotbar")[i - 1].style.zIndex = "0";
				    	if(e.key == i.toString()){
				    		slot = i;
				    		blockToBePlaced = hotbar[slot - 1]
				    		document.getElementsByClassName("hotbar")[i - 1].style.opacity = "1";
				    		document.getElementsByClassName("hotbar")[i - 1].style.border = "2px solid black";
				    		document.getElementsByClassName("hotbar")[i - 1].style.zIndex = "1";
				    	}
				    }
				}

				keys.push(e.key);

				if(e.key == controlOptions.jump && canJump == true && controls.isLocked){
					ySpeed = -1;
					canJump = false;
				}
				if(e.key == controlOptions.placeBlock){
					const raycaster = new THREE.Raycaster();
					const pointer = new THREE.Vector2();
					pointer.x = (0.5) * 2 - 1;
					pointer.y = -1 * (0.5) * 2 + 1;
					raycaster.setFromCamera(pointer, camera);
					var intersection;
					var next = false;
					var distance = Infinity;
					var placedInWater = false;
					for(var i = 0; i < blocks.length; i++){
						var int = raycaster.intersectObject(blocks[i].mesh);
						if(int[0] != undefined && int[0].distance < 40 && int[0].distance < distance){
							if(blocks[i].name == "water"){
								placedInWater = true;
								continue;
							}
							next = true;
							intersection = int;
							distance = int[0].distance;
						}
					}

					if(next){
						console.log(intersection[0]);
						var materialIndex = intersection[0].face.materialIndex;
						var position = intersection[0].point; // object with x, y and z coords
						var x = 0;
						var y = 0;
						var z = 0;
						const inc = 2.5; 
						switch(materialIndex){
							case 0: // right
								x = position.x + inc;
								y = Math.round(position.y / 5) * 5;
								z = Math.round(position.z / 5) * 5;
								break;
							case 1: // left
								x = position.x - inc;
								y = Math.round(position.y / 5) * 5;
								z = Math.round(position.z / 5) * 5;
								break;
							case 2: // top
								x = Math.round(position.x / 5) * 5;
								y = position.y + inc;
								z = Math.round(position.z / 5) * 5;
								break;
							case 3: // bottom
								x = Math.round(position.x / 5) * 5;
								y = position.y - inc;
								z = Math.round(position.z / 5) * 5;
								break;
							case 4: // front
								x = Math.round(position.x / 5) * 5;
								y = Math.round(position.y / 5) * 5;
								z = position.z + inc;
								break;
							case 5: // back
								x = Math.round(position.x / 5) * 5;
								y = Math.round(position.y / 5) * 5;
								z = position.z - inc;
								break;
						}
						y = Math.round(y); // sometimes, y is for some reason e.g 4.999999999999
						if(y > minWorldY){
							var b = new Block(x, y, z, true, blockToBePlaced);
							if(!intersect(b.x, b.y, b.z, 5, 5, 5, player.x, player.y, player.z, player.w, player.h, player.d)){
								chunks[identifyChunk(x, z)].push(b);
								placedBlocks.push(b);

								// Placing in water
								if(placedInWater){
									for(var i = 0; i < chunks[identifyChunk(x, z)].length; i++){
										if(chunks[identifyChunk(x, z)][i].x == x && chunks[identifyChunk(x, z)][i].y == y && chunks[identifyChunk(x, z)][i].z == z && chunks[identifyChunk(x, z)][i].blockType == "water"){
											// found that water block!
											chunks[identifyChunk(x, z)].splice(i, 1);
											brokenBlocks.push(new Block(x, y, z, false, "water"));
											scene.remove(blocks[waterIndex].mesh);
											blocks[waterIndex].mesh = new THREE.InstancedMesh(blockBox, blocks[waterIndex].materialArray, (renderDistance * renderDistance * chunkSize * chunkSize * depth) - brokenBlocks.length);
											blocks[waterIndex].count = 0;
											break;
										}
									}
								}

								// Updated chunks of placed block
								var index = blockTypes.indexOf(blockToBePlaced);
								scene.remove(blocks[index].mesh);
								blocks[index].mesh = new THREE.InstancedMesh(blockBox, blocks[index].materialArray, (renderDistance * renderDistance * chunkSize * chunkSize * depth) + placedBlocks.length);
								blocks[index].count = 0;

								for(var i = 0; i < chunks.length; i++){
									for(var j = 0; j < chunks[i].length; j++){
										let matrix = new THREE.Matrix4().makeTranslation(
											chunks[i][j].x,
											chunks[i][j].y,
											chunks[i][j].z
										);
										if(chunks[i][j].blockType == blockToBePlaced){
											blocks[index].mesh.setMatrixAt(blocks[index].count, matrix);
											blocks[index].count++;
										}
										if(chunks[i][j].blockType == "water"){
											blocks[waterIndex].mesh.setMatrixAt(blocks[waterIndex].count, matrix);
											blocks[waterIndex].count++;
										}
									}
								}
								scene.add(blocks[index].mesh);
								scene.add(blocks[waterIndex].mesh);
							}	
						}	
					}
				}
			});
			document.addEventListener("keyup", function(e){
				var newArr = [];
				for(var i = 0; i < keys.length; i++){
					if(keys[i] != e.key){
						newArr.push(keys[i]);
					}
				}
				keys = newArr;
				if(!keys.includes("w")){
					sprint = false;
				}
			});

			var controls = new THREE.PointerLockControls(camera, document.body);
			controls.lock();
			document.body.addEventListener("click", function(){
				controls.lock();
				// Breaking blocks
				if(controls.isLocked){
					// Shooting a ray
					const raycaster = new THREE.Raycaster();
					const pointer = new THREE.Vector2();
					pointer.x = (0.5) * 2 - 1;
					pointer.y = -1 * (0.5) * 2 + 1;
					raycaster.setFromCamera(pointer, camera);
					var intersection;
					var next = false;
					var distance = Infinity;
					for(var i = 0; i < blocks.length; i++){
						var int = raycaster.intersectObject(blocks[i].mesh);
						if(int[0] != undefined && int[0].distance < 40 && int[0].distance < distance && blocks[i].name != "water"){
							next = true;
							intersection = int;
							distance = int[0].distance;
						}
					}
					if(intersection[0] != undefined && intersection[0].distance < 40){
						// finding x, y, z positions of that 
						console.log(intersection[0].point);
						var materialIndex = intersection[0].face.materialIndex;
						var position = intersection[0].point; // object with x, y and z coords
						var x = 0;
						var y = 0;
						var z = 0;
						const inc = 2.5; 
						switch(materialIndex){ // finding x, y, z positions of block
							case 0: // right
								x = position.x - inc;
								y = Math.round(position.y / 5) * 5;
								z = Math.round(position.z / 5) * 5;
								break;
							case 1: // left
								x = position.x + inc;
								y = Math.round(position.y / 5) * 5;
								z = Math.round(position.z / 5) * 5;
								break;
							case 2: // top
								x = Math.round(position.x / 5) * 5;
								y = position.y - inc;
								z = Math.round(position.z / 5) * 5;
								break;
							case 3: // bottom
								x = Math.round(position.x / 5) * 5;
								y = position.y + inc;
								z = Math.round(position.z / 5) * 5;
								break;
							case 4: // front
								x = Math.round(position.x / 5) * 5;
								y = Math.round(position.y / 5) * 5;
								z = position.z - inc;
								break;
							case 5: // back
								x = Math.round(position.x / 5) * 5;
								y = Math.round(position.y / 5) * 5;
								z = position.z + inc;
								break;
						}
						// Find block with those x, y, z positions
						// More efficient by finding it inside it's chunk
						var index1 = identifyChunk(x, z);
						var chunk = chunks[index1];
						y = Math.round(y); // sometimes, y is for some reason e.g 4.999999999999
						var blockToBeDestroyed = null; // BLOCK WHICH WILL NOW BE DESTROYED!
						for(var i = 0; i < chunk.length; i++){
							if(chunk[i].x == x && chunk[i].y == y && chunk[i].z == z){
								// Found the block!
								if(chunk[i].placed){
									// find the placedBlock and remove it
									for(var j = 0; j < placedBlocks.length; j++){
										if(placedBlocks[j].x == x && placedBlocks[j].y == y && placedBlocks[j].z == z){
											placedBlocks.splice(j, 1);
											break;
										}
									}
								} else { // if it is a normal block
									brokenBlocks.push(new Block(x, y, z, false, chunk[i].blockType));
								}
								blockToBeDestroyed = chunk[i].blockType;
								chunks[index1].splice(i, 1); // block is removed from chunks variable
								break;
							}
						}
						// update chunks, array.splice(index, 1);
						var index = blockTypes.indexOf(blockToBeDestroyed);
						scene.remove(blocks[index].mesh);
						blocks[index].mesh = new THREE.InstancedMesh(blockBox, blocks[index].materialArray, (renderDistance * renderDistance * chunkSize * chunkSize * depth) + placedBlocks.length);
						blocks[index].count = 0;

						for(var i = 0; i < chunks.length; i++){
							for(var j = 0; j < chunks[i].length; j++){
								let matrix = new THREE.Matrix4().makeTranslation(
									chunks[i][j].x,
									chunks[i][j].y,
									chunks[i][j].z
								);
								if(chunks[i][j].blockType == blockToBeDestroyed){
									blocks[index].mesh.setMatrixAt(blocks[index].count, matrix);
									blocks[index].count++;
								}
							}
						}
						scene.add(blocks[index].mesh);
					}
				}
			});
			controls.addEventListener("lock", function(){
				document.getElementById("escapeScreenGUI").style.display = "none";
			});
			controls.addEventListener("unlock", function(){
				document.getElementById("escapeScreenGUI").style.display = "block";
				keys = [];
			});

			var movingSpeed = 0.5;
			var ySpeed = 0;
			var acc = 0.065;

			var player = {
				w : 0.6, // width
				h : 8, // height
				d : 0.5, // depth
				x : camera.position.x,
				y : camera.position.y,
				z : camera.position.z,
				forward : function(speed){
					controls.moveForward(speed);
					this.updatePosition();
				},
				backward : function(speed){
					controls.moveForward(-1 * speed);
					this.updatePosition();
				},
				right : function(speed){
					controls.moveRight(speed);
					this.updatePosition();
				},
				left : function(speed){
					controls.moveRight(-1 * speed);
					this.updatePosition();
				},
				updatePosition : function(){
					this.x = camera.position.x;
					this.y = camera.position.y - (this.h / 2);
					this.z = camera.position.z;
				}
			};

			function intersect(x1, y1, z1, w1, h1, d1, x2, y2, z2, w2, h2, d2){
				var a = {
					minX : x1 - (w1/2),
					maxX : x1 + (w1/2),
					minZ : z1 - (d1/2),
					maxZ : z1 + (d1/2),
					minY : y1 - (h1/2),
					maxY : y1 + (h1/2),
				};
				var b = {
					minX : x2 - (w2/2),
					maxX : x2 + (w2/2),
					minZ : z2 - (d2/2),
					maxZ : z2 + (d2/2),
					minY : y2 - (h2/2),
					maxY : y2 + (h2/2),
				};
				return (a.minX <= b.maxX && a.maxX >= b.minX) &&
			           (a.minY <= b.maxY && a.maxY >= b.minY) &&
			           (a.minZ <= b.maxZ && a.maxZ >= b.minZ);
			}

			var deceleration = 1.35;
			var forback = 0; // 1 = forward, -1 = backward
			var rightleft = 0; // 1 = right, -1 = left
			var sprintSpeedInc = 1.6; // 30% faster than walking
			function update(){	
				player.updatePosition();

				if(controls.isLocked){
					if(keys.includes(controlOptions.forward)){
						player.forward(movingSpeed * (sprint ? sprintSpeedInc : 1));
						forback = 1 * movingSpeed;
						for(var i = 0; i < chunks.length; i++){
							for(var j = 0; j < chunks[i].length; j++){
								var b = chunks[i][j];
								var c = intersect(b.x, b.y, b.z, 5, 5, 5, player.x, player.y, player.z, player.w, player.h, player.d);
								if(c && (b.y - 2.5 < player.y + (player.h / 2) && b.y + 2.5 > player.y - (player.h / 2)) && b.blockType != "water"){
									player.backward((movingSpeed * (sprint ? sprintSpeedInc : 1)));
									forback = 0;
									rightleft = 0;
									sprint = false;
								}
							}
						}
					}
					if(keys.includes(controlOptions.backward)){
						player.backward(movingSpeed * (sprint ? sprintSpeedInc : 1));
						forback = -1 * movingSpeed;
						for(var i = 0; i < chunks.length; i++){
							for(var j = 0; j < chunks[i].length; j++){
								var b = chunks[i][j];
								var c = intersect(b.x, b.y, b.z, 5, 5, 5, player.x, player.y, player.z, player.w, player.h, player.d);
								if(c && (b.y - 2.5 < player.y + (player.h / 2) && b.y + 2.5 > player.y - (player.h / 2)) && b.blockType != "water"){
									player.forward(movingSpeed * (sprint ? sprintSpeedInc : 1));
									forback = 0;
									rightleft = 0;
									sprint = false;
								}
							}
						}
					}
					if(keys.includes(controlOptions.right)){
						player.right(movingSpeed * (sprint ? sprintSpeedInc : 1));
						rightleft = 1 * movingSpeed;
						for(var i = 0; i < chunks.length; i++){
							for(var j = 0; j < chunks[i].length; j++){
								var b = chunks[i][j];
								var c = intersect(b.x, b.y, b.z, 5, 5, 5, player.x, player.y, player.z, player.w, player.h, player.d);
								if(c && (b.y - 2.5 < player.y + (player.h / 2) && b.y + 2.5 > player.y - (player.h / 2)) && b.blockType != "water"){
									player.left(movingSpeed * (sprint ? sprintSpeedInc : 1));
									forback = 0;
									rightleft = 0;
									sprint = false;
								}
							}
						}
					}
					if(keys.includes(controlOptions.left)){
						player.left(movingSpeed * (sprint ? sprintSpeedInc : 1));
						rightleft = -1 * movingSpeed;
						for(var i = 0; i < chunks.length; i++){
							for(var j = 0; j < chunks[i].length; j++){
								var b = chunks[i][j];
								var c = intersect(b.x, b.y, b.z, 5, 5, 5, player.x, player.y, player.z, player.w, player.h, player.d);
								if(c && (b.y - 2.5 < player.y + (player.h / 2) && b.y + 2.5 > player.y - (player.h / 2)) && b.blockType != "water"){
									player.right(movingSpeed * (sprint ? sprintSpeedInc : 1));
									forback = 0;
									rightleft = 0;
									sprint = false;
								}
							}
						}
					}
				}

				// Decceleration part
				if(!keys.includes(controlOptions.forward) && !keys.includes(controlOptions.backward) && !keys.includes(controlOptions.right) && !keys.includes(controlOptions.left)){
					forback /= deceleration;
					rightleft /= deceleration;
					for(var i = 0; i < chunks.length; i++){
						for(var j = 0; j < chunks[i].length; j++){
							var b = chunks[i][j];
							var c = intersect(b.x, b.y, b.z, 5, 5, 5, player.x, player.y, player.z, player.w, player.h, player.d);
							if(c && (b.y - 2.5 < player.y + (player.h / 2) && b.y + 2.5 > player.y - (player.h / 2))){
								var br = true;
								forback /= -deceleration;
								rightleft /= -deceleration;
								sprint = false;
								break;
							}
						}
						if(br){
							break;
						}
					}
					player.forward(forback * (sprint ? sprintSpeedInc : 1));
					player.right(rightleft * (sprint ? sprintSpeedInc : 1));
				}
				
				camera.position.y = camera.position.y - ySpeed;
				ySpeed = ySpeed + acc;

				// Not falling through a block or above a block (above collision)
				for(var i = 0; i < chunks.length; i++){
					for(var j = 0; j < chunks[i].length; j++){
						var b = chunks[i][j];
						var c = intersect(b.x, b.y + 10, b.z, 5, 5, 5, player.x, player.y, player.z, player.w, player.h, player.d);
						if(c && camera.position.y <= chunks[i][j].y + 2.5 + player.h && camera.position.y >= chunks[i][j].y && b.blockType != "water"){
							camera.position.y = chunks[i][j].y + 2.5 + player.h;
							ySpeed = 0;
							canJump = true;
						}
						var c = intersect(b.x, b.y, b.z, 5, 5, 5, player.x, player.y, player.z, player.w, player.h, player.d); // this one doesn't have a + 10 in the b.y
						if(c && camera.position.y >= chunks[i][j].y - 2.5 && camera.position.y <= chunks[i][j].y && b.blockType != "water"){
							ySpeed = 0.5;
						}
					}
				}

				// INFINITE TERRAIN GENERATION PART!
				var worldSize = chunkSize * renderDistance * 5;
				var ratio = 0.4;
				if(camera.position.z < lowestZBlock() + (worldSize * ratio)){ // 20 is 4 blocks
					/*
						
						[0], [3], [6],
						[1], [x], [7],
						[2], [5], [8],
					*/

					var newChunks = [];
					for(var i = 0; i < chunks.length; i++){
						if((i + 1) % renderDistance != 0){
							newChunks.push(chunks[i]);
						}
					}

					// add blocks
					var lowestX = lowestXBlock();
					var lowestZ = lowestZBlock();

					for(var i = 0; i < renderDistance; i++){
						var chunk = [];
						for(var x = lowestX + (i * chunkSize * 5); x < lowestX + (i * chunkSize * 5) + (chunkSize * 5); x = x + 5){
							for(var z = lowestZ - (chunkSize * 5); z < lowestZ; z = z + 5){
								xoff = inc * x / 5;
								zoff = inc * z / 5;
								noise.seed(worldGen);
								var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
								noise.seed(biomeGen);
								var biome = getBiome(noise.perlin2(xoff / biomeSize, zoff / biomeSize));
								noise.seed(treesGen);
								var treeNoise = noise.perlin2(xoff / treeDensity, zoff / treeDensity);
								var canPutLeaf = false;
								for(var xInc = -5; xInc <= 5; xInc += 5){
									for(var zInc = -5; zInc <= 5; zInc += 5){
										if(xInc == 0 && zInc == 0){
											continue;
										}
										var xoffAround = inc * (x + xInc) / 5;
										var zoffAround = inc * (z + zInc) / 5;
										var treeNoiseAround = noise.perlin2(xoffAround / treeDensity, zoffAround / treeDensity);
										if(parseFloat(treeNoiseAround.toFixed(3)) == 0.001){
											canPutLeaf = true;
											break;
										}
									}
								}
								var waterExistsHere = false;
								var h = 5;
								while(true){
									var brokenWaterBlock = false;
									for(var d = 0; d < brokenBlocks.length; d++){
										if(brokenBlocks[d].x == x && brokenBlocks[d].y == v + h && brokenBlocks[d].z == z){
											brokenWaterBlock = true;
											break;
										}
									}
									if(v + h <= waterLevel && brokenWaterBlock == false){ // if there is a broken water block, it has to be water
										let matrix = new THREE.Matrix4().makeTranslation(
											x,
											v + h,
											z
										);
										chunk.push(new Block(x, v + h, z, false, blocks[waterIndex].name));
										h += 5;
										waterExistsHere = true;
									} else {
										break;
									}
								}
								for(var e = -8; e < depth; e++){
									if(v - (e * 5) < minWorldY){
										continue;
									}
									// Try to find a broken block in that position
									var blockIsDestroyed = false;
									for(var d = 0; d < brokenBlocks.length; d++){
										if(brokenBlocks[d].x == x && brokenBlocks[d].y == v - (e * 5) && brokenBlocks[d].z == z){
											blockIsDestroyed = true;
											break;
										}
									}
									if(!blockIsDestroyed){
										if(e >= 0){
											for(var t = 0; t < blocks.length; t++){
												if(blocks[t].range.includes(e) && blocks[t].biomes.includes(biome)){
													chunk.push(new Block(x, v - (e * 5), z, false, blocks[t].name));
													break;
												}
											}
										} else {
											// TREES!
											if(biome == "plains" && waterExistsHere == false){
												// LOGS
												if(parseFloat(treeNoise.toFixed(3)) == 0.001){
													if(e < 0 && e >= -8){
														let logMatrix = new THREE.Matrix4().makeTranslation(
															x,
															v - (e * 5),
															z
														);
														if(e != -8){
															chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLogIndex].name));
														} else { // TOP LEAf
															chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLeavesIndex].name));
														}
													}
												}
												// LEAVES
												if(e <= -6 && canPutLeaf){
													if(parseFloat(treeNoise.toFixed(3)) != 0.001){
														let leafMatrix = new THREE.Matrix4().makeTranslation(
															x,
															v - (e * 5),
															z
														);
														chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLeavesIndex].name));
													}
												}
											}
										}
									}
								}
								// Check if there is also placed blocks there
								for(var b = 0; b < placedBlocks.length; b++){
									if(placedBlocks[b].x == x && placedBlocks[b].z == z){
										chunk.push(new Block(placedBlocks[b].x, placedBlocks[b].y, placedBlocks[b].z, true, placedBlocks[b].blockType));
									}
								}
							}
						}
						newChunks.splice(i * renderDistance, 0, chunk);
					}

					chunks = newChunks;

					for(var i = 0; i < blocks.length; i++){
						scene.remove(blocks[i].mesh);
						blocks[i].mesh = new THREE.InstancedMesh(blockBox, blocks[i].materialArray, (renderDistance * renderDistance * chunkSize * chunkSize * depth) + placedBlocks.length);
						blocks[i].count = 0;
					}

					for(var i = 0; i < chunks.length; i++){
						for(var j = 0; j < chunks[i].length; j++){
							let matrix = new THREE.Matrix4().makeTranslation(
								chunks[i][j].x,
								chunks[i][j].y,
								chunks[i][j].z
							);
							for(var t = 0; t < blocks.length; t++){
								if(blocks[t].name == chunks[i][j].blockType){
									blocks[t].mesh.setMatrixAt(blocks[t].count, matrix);
									blocks[t].count++;
									break;
								}
							}
						}
					}
					
					for(var i = 0; i < blocks.length; i++){
						scene.add(blocks[i].mesh);
					}
				}

				if(camera.position.z > highestZBlock() - (worldSize * ratio)){ // 20 is 4 blocks
					/*
						
						[0], [3], [6],
						[1], [x], [7],
						[2], [5], [8],
					*/

					var newChunks = [];
					for(var i = 0; i < chunks.length; i++){
						if(i % renderDistance != 0){
							newChunks.push(chunks[i]);
						}
					}

					// add blocks
					var lowestX = lowestXBlock();
					var highestZ = highestZBlock();
					for(var i = 0; i < renderDistance; i++){
						var chunk = [];
						for(var x = lowestX + (i * chunkSize * 5); x < lowestX + (i * chunkSize * 5) + (chunkSize * 5); x = x + 5){
							for(var z = highestZ + 5; z < (highestZ + 5) + (chunkSize * 5); z = z + 5){
								xoff = inc * x / 5;
								zoff = inc * z / 5;
								noise.seed(worldGen);
								var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
								noise.seed(biomeGen);
								var biome = getBiome(noise.perlin2(xoff / biomeSize, zoff / biomeSize));
								noise.seed(treesGen);
								var treeNoise = noise.perlin2(xoff / treeDensity, zoff / treeDensity);
								var canPutLeaf = false;
								for(var xInc = -5; xInc <= 5; xInc += 5){
									for(var zInc = -5; zInc <= 5; zInc += 5){
										if(xInc == 0 && zInc == 0){
											continue;
										}
										var xoffAround = inc * (x + xInc) / 5;
										var zoffAround = inc * (z + zInc) / 5;
										var treeNoiseAround = noise.perlin2(xoffAround / treeDensity, zoffAround / treeDensity);
										if(parseFloat(treeNoiseAround.toFixed(3)) == 0.001){
											canPutLeaf = true;
											break;
										}
									}
								}
								var waterExistsHere = false;
								var h = 5;
								while(true){
									var brokenWaterBlock = false;
									for(var d = 0; d < brokenBlocks.length; d++){
										if(brokenBlocks[d].x == x && brokenBlocks[d].y == v + h && brokenBlocks[d].z == z){
											brokenWaterBlock = true;
											break;
										}
									}
									if(v + h <= waterLevel && brokenWaterBlock == false){ // if there is a broken water block, it has to be water
										let matrix = new THREE.Matrix4().makeTranslation(
											x,
											v + h,
											z
										);
										chunk.push(new Block(x, v + h, z, false, blocks[waterIndex].name));
										h += 5;
										waterExistsHere = true;
									} else {
										break;
									}
								}
								for(var e = -8; e < depth; e++){
									if(v - (e * 5) < minWorldY){
										continue;
									}
									// Try to find a broken block in that position
									var blockIsDestroyed = false;
									for(var d = 0; d < brokenBlocks.length; d++){
										if(brokenBlocks[d].x == x && brokenBlocks[d].y == v - (e * 5) && brokenBlocks[d].z == z){
											blockIsDestroyed = true;
											break;
										}
									}
									if(!blockIsDestroyed){
										if(e >= 0){
											for(var t = 0; t < blocks.length; t++){
												if(blocks[t].range.includes(e) && blocks[t].biomes.includes(biome)){
													chunk.push(new Block(x, v - (e * 5), z, false, blocks[t].name));
													break;
												}
											}
										} else {
											// TREES!
											if(biome == "plains" && waterExistsHere == false){
												// LOGS
												if(parseFloat(treeNoise.toFixed(3)) == 0.001){
													if(e < 0 && e >= -8){
														let logMatrix = new THREE.Matrix4().makeTranslation(
															x,
															v - (e * 5),
															z
														);
														if(e != -8){
															chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLogIndex].name));
														} else { // TOP LEAf
															chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLeavesIndex].name));
														}
													}
												}
												// LEAVES
												if(e <= -6 && canPutLeaf){
													if(parseFloat(treeNoise.toFixed(3)) != 0.001){
														let leafMatrix = new THREE.Matrix4().makeTranslation(
															x,
															v - (e * 5),
															z
														);
														chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLeavesIndex].name));
													}
												}
											}
										}
									}
								}
								// Check if there is also placed blocks there
								for(var b = 0; b < placedBlocks.length; b++){
									if(placedBlocks[b].x == x && placedBlocks[b].z == z){
										chunk.push(new Block(placedBlocks[b].x, placedBlocks[b].y, placedBlocks[b].z, true, placedBlocks[b].blockType));
									}
								}
							}
						}
						newChunks.splice(((i + 1) * renderDistance) - 1, 0, chunk);
					}

					chunks = newChunks;

					for(var i = 0; i < blocks.length; i++){
						scene.remove(blocks[i].mesh);
						blocks[i].mesh = new THREE.InstancedMesh(blockBox, blocks[i].materialArray, (renderDistance * renderDistance * chunkSize * chunkSize * depth) + placedBlocks.length);
						blocks[i].count = 0;
					}

					for(var i = 0; i < chunks.length; i++){
						for(var j = 0; j < chunks[i].length; j++){
							let matrix = new THREE.Matrix4().makeTranslation(
								chunks[i][j].x,
								chunks[i][j].y,
								chunks[i][j].z
							);
							for(var t = 0; t < blocks.length; t++){
								if(blocks[t].name == chunks[i][j].blockType){
									blocks[t].mesh.setMatrixAt(blocks[t].count, matrix);
									blocks[t].count++;
									break;
								}
							}
						}
					}
					
					for(var i = 0; i < blocks.length; i++){
						scene.add(blocks[i].mesh);
					}	
				}

				if(camera.position.x > highestXBlock() - (worldSize * ratio)){ // 20 is 4 blocks
					/*
						
						[0], [3], [6],
						[1], [x], [7],
						[2], [5], [8],
					*/

					var newChunks = [];
					for(var i = renderDistance; i < chunks.length; i++){
						newChunks.push(chunks[i]);
					}

					// add blocks
					var highestX = highestXBlock();
					var lowestZ = lowestZBlock();

					for(var i = 0; i < renderDistance; i++){
						var chunk = [];
						for(var z = lowestZ + (i * chunkSize * 5); z < lowestZ + (i * chunkSize * 5) + (chunkSize * 5); z = z + 5){
							for(var x = highestX + 5; x < highestX + 5 + (chunkSize * 5); x = x + 5){
								xoff = inc * x / 5;
								zoff = inc * z / 5;
								noise.seed(worldGen);
								var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
								noise.seed(biomeGen);
								var biome = getBiome(noise.perlin2(xoff / biomeSize, zoff / biomeSize));
								noise.seed(treesGen);
								var treeNoise = noise.perlin2(xoff / treeDensity, zoff / treeDensity);
								var canPutLeaf = false;
								for(var xInc = -5; xInc <= 5; xInc += 5){
									for(var zInc = -5; zInc <= 5; zInc += 5){
										if(xInc == 0 && zInc == 0){
											continue;
										}
										var xoffAround = inc * (x + xInc) / 5;
										var zoffAround = inc * (z + zInc) / 5;
										var treeNoiseAround = noise.perlin2(xoffAround / treeDensity, zoffAround / treeDensity);
										if(parseFloat(treeNoiseAround.toFixed(3)) == 0.001){
											canPutLeaf = true;
											break;
										}
									}
								}
								var waterExistsHere = false;
								var h = 5;
								while(true){
									var brokenWaterBlock = false;
									for(var d = 0; d < brokenBlocks.length; d++){
										if(brokenBlocks[d].x == x && brokenBlocks[d].y == v + h && brokenBlocks[d].z == z){
											brokenWaterBlock = true;
											break;
										}
									}
									if(v + h <= waterLevel && brokenWaterBlock == false){ // if there is a broken water block, it has to be water
										let matrix = new THREE.Matrix4().makeTranslation(
											x,
											v + h,
											z
										);
										chunk.push(new Block(x, v + h, z, false, blocks[waterIndex].name));
										h += 5;
										waterExistsHere = true;
									} else {
										break;
									}
								}
								for(var e = -8; e < depth; e++){
									if(v - (e * 5) < minWorldY){
										continue;
									}
									// Try to find a broken block in that position
									var blockIsDestroyed = false;
									for(var d = 0; d < brokenBlocks.length; d++){
										if(brokenBlocks[d].x == x && brokenBlocks[d].y == v - (e * 5) && brokenBlocks[d].z == z){
											blockIsDestroyed = true;
											break;
										}
									}
									if(!blockIsDestroyed){
										if(e >= 0){
											for(var t = 0; t < blocks.length; t++){
												if(blocks[t].range.includes(e) && blocks[t].biomes.includes(biome)){
													chunk.push(new Block(x, v - (e * 5), z, false, blocks[t].name));
													break;
												}
											}
										} else {
											// TREES!
											if(biome == "plains" && waterExistsHere == false){
												// LOGS
												if(parseFloat(treeNoise.toFixed(3)) == 0.001){
													if(e < 0 && e >= -8){
														let logMatrix = new THREE.Matrix4().makeTranslation(
															x,
															v - (e * 5),
															z
														);
														if(e != -8){
															chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLogIndex].name));
														} else { // TOP LEAf
															chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLeavesIndex].name));
														}
													}
												}
												// LEAVES
												if(e <= -6 && canPutLeaf){
													if(parseFloat(treeNoise.toFixed(3)) != 0.001){
														let leafMatrix = new THREE.Matrix4().makeTranslation(
															x,
															v - (e * 5),
															z
														);
														chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLeavesIndex].name));
													}
												}
											}
										}
									}
								}
								// Check if there is also placed blocks there
								for(var b = 0; b < placedBlocks.length; b++){
									if(placedBlocks[b].x == x && placedBlocks[b].z == z){
										chunk.push(new Block(placedBlocks[b].x, placedBlocks[b].y, placedBlocks[b].z, true, placedBlocks[b].blockType));
									}
								}
							}
						}
						newChunks.splice(chunks.length - (renderDistance - i), 0, chunk);
					}

					chunks = newChunks;

					for(var i = 0; i < blocks.length; i++){
						scene.remove(blocks[i].mesh);
						blocks[i].mesh = new THREE.InstancedMesh(blockBox, blocks[i].materialArray, (renderDistance * renderDistance * chunkSize * chunkSize * depth) + placedBlocks.length);
						blocks[i].count = 0;
					}

					for(var i = 0; i < chunks.length; i++){
						for(var j = 0; j < chunks[i].length; j++){
							let matrix = new THREE.Matrix4().makeTranslation(
								chunks[i][j].x,
								chunks[i][j].y,
								chunks[i][j].z
							);
							for(var t = 0; t < blocks.length; t++){
								if(blocks[t].name == chunks[i][j].blockType){
									blocks[t].mesh.setMatrixAt(blocks[t].count, matrix);
									blocks[t].count++;
									break;
								}
							}
						}
					}
					
					for(var i = 0; i < blocks.length; i++){
						scene.add(blocks[i].mesh);
					}			
				}

				if(camera.position.x < lowestXBlock() + (worldSize * ratio)){ // 20 is 4 blocks
					/*
						
						[0], [3], [6],
						[1], [x], [7],
						[2], [5], [8],
					*/

					var newChunks = [];
					for(var i = 0; i < chunks.length - renderDistance; i++){
						newChunks.push(chunks[i]);
					}

					// add blocks
					var lowestX = lowestXBlock();
					var lowestZ = lowestZBlock();
					for(var i = 0; i < renderDistance; i++){
						var chunk = [];
						for(var z = lowestZ + (i * chunkSize * 5); z < lowestZ + (i * chunkSize * 5) + (chunkSize * 5); z = z + 5){
							for(var x = lowestX - (chunkSize * 5); x < lowestX; x = x + 5){
								xoff = inc * x / 5;
								zoff = inc * z / 5;
								noise.seed(worldGen);
								var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
								noise.seed(biomeGen);
								var biome = getBiome(noise.perlin2(xoff / biomeSize, zoff / biomeSize));
								noise.seed(treesGen);
								var treeNoise = noise.perlin2(xoff / treeDensity, zoff / treeDensity);
								var canPutLeaf = false;
								for(var xInc = -5; xInc <= 5; xInc += 5){
									for(var zInc = -5; zInc <= 5; zInc += 5){
										if(xInc == 0 && zInc == 0){
											continue;
										}
										var xoffAround = inc * (x + xInc) / 5;
										var zoffAround = inc * (z + zInc) / 5;
										var treeNoiseAround = noise.perlin2(xoffAround / treeDensity, zoffAround / treeDensity);
										if(parseFloat(treeNoiseAround.toFixed(3)) == 0.001){
											canPutLeaf = true;
											break;
										}
									}
								}
								var waterExistsHere = false;
								var h = 5;
								while(true){
									var brokenWaterBlock = false;
									for(var d = 0; d < brokenBlocks.length; d++){
										if(brokenBlocks[d].x == x && brokenBlocks[d].y == v + h && brokenBlocks[d].z == z){
											brokenWaterBlock = true;
											break;
										}
									}
									if(v + h <= waterLevel && brokenWaterBlock == false){ // if there is a broken water block, it has to be water
										let matrix = new THREE.Matrix4().makeTranslation(
											x,
											v + h,
											z
										);
										chunk.push(new Block(x, v + h, z, false, blocks[waterIndex].name));
										h += 5;
										waterExistsHere = true;
									} else {
										break;
									}
								}
								for(var e = -8; e < depth; e++){
									if(v - (e * 5) < minWorldY){
										continue;
									}
									// Try to find a broken block in that position
									var blockIsDestroyed = false;
									for(var d = 0; d < brokenBlocks.length; d++){
										if(brokenBlocks[d].x == x && brokenBlocks[d].y == v - (e * 5) && brokenBlocks[d].z == z){
											blockIsDestroyed = true;
											break;
										}
									}
									if(!blockIsDestroyed){
										if(e >= 0){
											for(var t = 0; t < blocks.length; t++){
												if(blocks[t].range.includes(e) && blocks[t].biomes.includes(biome)){
													chunk.push(new Block(x, v - (e * 5), z, false, blocks[t].name));
													break;
												}
											}
										} else {
											// TREES!
											if(biome == "plains" && waterExistsHere == false){
												// LOGS
												if(parseFloat(treeNoise.toFixed(3)) == 0.001){
													if(e < 0 && e >= -8){
														let logMatrix = new THREE.Matrix4().makeTranslation(
															x,
															v - (e * 5),
															z
														);
														if(e != -8){
															chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLogIndex].name));
														} else { // TOP LEAf
															chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLeavesIndex].name));
														}
													}
												}
												// LEAVES
												if(e <= -6 && canPutLeaf){
													if(parseFloat(treeNoise.toFixed(3)) != 0.001){
														let leafMatrix = new THREE.Matrix4().makeTranslation(
															x,
															v - (e * 5),
															z
														);
														chunk.push(new Block(x, v - (e * 5), z, false, blocks[oakLeavesIndex].name));
													}
												}
											}
										}
									}
								}
								// Check if there is also placed blocks there
								for(var b = 0; b < placedBlocks.length; b++){
									if(placedBlocks[b].x == x && placedBlocks[b].z == z){
										chunk.push(new Block(placedBlocks[b].x, placedBlocks[b].y, placedBlocks[b].z, true, placedBlocks[b].blockType));
									}
								}
							}
						}
						newChunks.splice(i, 0, chunk);
					}

					chunks = newChunks;

					for(var i = 0; i < blocks.length; i++){
						scene.remove(blocks[i].mesh);
						blocks[i].mesh = new THREE.InstancedMesh(blockBox, blocks[i].materialArray, (renderDistance * renderDistance * chunkSize * chunkSize * depth) + placedBlocks.length);
						blocks[i].count = 0;
					}

					for(var i = 0; i < chunks.length; i++){
						for(var j = 0; j < chunks[i].length; j++){
							let matrix = new THREE.Matrix4().makeTranslation(
								chunks[i][j].x,
								chunks[i][j].y,
								chunks[i][j].z
							);
							for(var t = 0; t < blocks.length; t++){
								if(blocks[t].name == chunks[i][j].blockType){
									blocks[t].mesh.setMatrixAt(blocks[t].count, matrix);
									blocks[t].count++;
									break;
								}
							}
						}
					}
					
					for(var i = 0; i < blocks.length; i++){
						scene.add(blocks[i].mesh);
					}
				}
			}

			function lowestXBlock(){
				var xPosArray = [];
				for(var i = 0; i < chunks.length; i++){
					for(var j = 0; j < chunks[i].length; j++){
						xPosArray.push(chunks[i][j].x);
					}
				}
				return Math.min.apply(null, xPosArray);
			}

			function highestXBlock(){
				var xPosArray = [];
				for(var i = 0; i < chunks.length; i++){
					for(var j = 0; j < chunks[i].length; j++){
						xPosArray.push(chunks[i][j].x);
					}
				}
				return Math.max.apply(null, xPosArray);
			}

			function lowestZBlock(){
				var zPosArray = [];
				for(var i = 0; i < chunks.length; i++){
					for(var j = 0; j < chunks[i].length; j++){
						zPosArray.push(chunks[i][j].z);
					}
				}
				return Math.min.apply(null, zPosArray);
			}

			function highestZBlock(){
				var zPosArray = [];
				for(var i = 0; i < chunks.length; i++){
					for(var j = 0; j < chunks[i].length; j++){
						zPosArray.push(chunks[i][j].z);
					}
				}
				return Math.max.apply(null, zPosArray);
			}

			// Resize Window
			window.addEventListener("resize", function(){
				renderer.setSize(window.innerWidth, window.innerHeight);
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				cursor.style.left = ((0.5 * window.innerWidth) - (0.5 * cursor.width)).toString() + "px";
	 			cursor.style.top = ((0.5 * window.innerHeight) - (0.5 * cursor.height)).toString() + "px";
	 			for(var i = 0; i < document.getElementsByClassName("hotbar").length; i++){
		 			document.getElementsByClassName("hotbar")[i].style.height = (0.05 * window.innerWidth).toString();
		 		}
			});

			const raycaster = new THREE.Raycaster();
			const pointer = new THREE.Vector2();
			pointer.x = (0.5) * 2 - 1;
			pointer.y = -1 * (0.5) * 2 + 1;

			var plane;
			function render(){
				raycaster.setFromCamera(pointer, camera);
				var intersection;
				var next = false;
				var distance = Infinity;
				/*
				for(var i = 0; i < blocks.length; i++){
					var int = raycaster.intersectObject(blocks[i].mesh);
					if(int[0] != undefined && int[0].distance < 40 && int[0].distance < distance && blocks[i].name != "water"){
						next = true;
						intersection = int;
						distance = int[0].distance;
					}
				}
				*/
				if(next){
					//console.log(intersection[0]);
					if(!scene.children.includes(plane)){
						var planeG = new THREE.PlaneGeometry(5, 5);
						var planeM = new THREE.MeshBasicMaterial({color : 0xffffff, side : THREE.DoubleSide});
						planeM.transparent = true;
						planeM.opacity = 0.5;
						plane = new THREE.Mesh(planeG, planeM);
						scene.add(plane);
					} else {
						plane.visible = true;
						var materialIndex = intersection[0].face.materialIndex;
						var position = intersection[0].point; // object with x, y and z coords
						var x = 0;
						var y = 0;
						var z = 0;
						const inc = 0.1; 
						switch(materialIndex){
							case 0: // right
								plane.rotation.x = 0;
								plane.rotation.y = (Math.PI / 2);
								plane.rotation.z = 0;
								x = position.x + inc;
								y = Math.round(position.y / 5) * 5;
								z = Math.round(position.z / 5) * 5;
								break;
							case 1: // left
								plane.rotation.x = 0;
								plane.rotation.y = (Math.PI / 2);
								plane.rotation.z = 0;
								x = position.x - inc;
								y = Math.round(position.y / 5) * 5;
								z = Math.round(position.z / 5) * 5;
								break;
							case 2: // top
								plane.rotation.x = (Math.PI / 2);
								plane.rotation.y = 0;
								plane.rotation.z = 0;
								x = Math.round(position.x / 5) * 5;
								y = position.y + inc;
								z = Math.round(position.z / 5) * 5;
								break;
							case 3: // bottom
								plane.rotation.x = (Math.PI / 2);
								plane.rotation.y = 0;
								plane.rotation.z = 0;
								x = Math.round(position.x / 5) * 5;
								y = position.y - inc;
								z = Math.round(position.z / 5) * 5;
								break;
							case 4: // front
								plane.rotation.x = 0;
								plane.rotation.y = 0;
								plane.rotation.z = 0;
								x = Math.round(position.x / 5) * 5;
								y = Math.round(position.y / 5) * 5;
								z = position.z + inc;
								break;
							case 5: // back
								plane.rotation.x = 0;
								plane.rotation.y = 0;
								plane.rotation.z = 0;
								x = Math.round(position.x / 5) * 5;
								y = Math.round(position.y / 5) * 5;
								z = position.z - inc;
								break;
						}
						plane.position.x = x;
						plane.position.y = y;
						plane.position.z = z;
					}
				} else {
					if(plane){
						plane.visible = false;
					}
				}

				renderer.render(scene, camera);
			}

			function GameLoop(){
				requestAnimationFrame(GameLoop);
				update();
				render();
			}

			GameLoop();
 		}