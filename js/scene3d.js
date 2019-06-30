// -------------------------------------------------------------------
//  首页三维场景
// -------------------------------------------------------------------

var birdNumber = new Array();
var birdTichang = new Array();
var Color = new Array();
var ColorNumber_hex = new Array();
var birdMesh;
var r = new Array();
var g = new Array();
var b = new Array();

d3.csv("./data/tabletsForInitial.csv", function (error, csvdata) {
        for (var i = 0; i < csvdata.length; i++) {
                var tichang = csvdata[i].long;
                var species = csvdata[i].specie;
                var number = csvdata[i].num;

                birdNumber[i] = parseInt(number);
                birdTichang[i] = parseInt(tichang);
                Color[i] = csvdata[i].colors;
                ColorNumber_hex[i] = csvdata[i].colorSeries;
                r[i] = csvdata[i].r;
                g[i] = csvdata[i].g;
                b[i] = csvdata[i].b;
        }

        init();
        animate();
});


if (!Detector.webgl) Detector.addGetWebGLMessage();

/*
 * TEXTURE WIDTH FOR SIMULATION *
 */

var WIDTH = 32;

var BIRDS = 1024;

// Custom Geometry - using 3 triangles each. No UVs, no normals currently.
THREE.BirdGeometry = function () {

        var triangles = BIRDS * 3;
        var points = triangles * 3;

        THREE.BufferGeometry.call(this);

        var vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
        var birdColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
        var references = new THREE.BufferAttribute(new Float32Array(points * 2), 2);
        var birdVertex = new THREE.BufferAttribute(new Float32Array(points), 1);

        this.addAttribute('position', vertices);
        this.addAttribute('birdColor', birdColors);
        this.addAttribute('reference', references);
        this.addAttribute('birdVertex', birdVertex);

        // this.addAttribute( 'normal', new Float32Array( points * 3 ), 3 );
        var v = 0;

        function verts_push() {
                for (var i = 0; i < arguments.length; i++) {
                        vertices.array[v++] = arguments[i];
                }
        }

        function getIndex() {
                index2++;
                if (birdNumber[index2] != 0) {
                        return index2;
                } else {
                        getIndex();
                }
        }

        var index = 0;
        var index2 = 0;
        var count = 0;
        for (var i = 0; i < BIRDS; i++) {

                //console.log(count + ", " + birdNumber[index]);
                if (count == birdNumber[index]) {
                        //index = getIndex();
                        getIndex();
                        index = index2;
                        count = 0;
                }
                count++;

                var size = birdTichang[index];

                var wingSpan_small = 50;
                var wingSpan_middle = 50;
                var wingSpan_large = 100;

                if (size < 50) {

                        verts_push(
                                0, -0, -20,
                                0, 4, -50,
                                0, 0, 20
                        );
                        verts_push(
                                0, 0, -15,
                                -wingSpan_small, 0, 0,//（第一个参数改了目测没变化,左右翼展改上面定义的upup）
                                0, 0, 15
                        );
                        verts_push(
                                0, 0, 15,
                                wingSpan_small, 0, 0,
                                0, 0, -15
                        )
                }
                else if (size < 100 && size >= 50) {

                        verts_push(
                                0, -0, -30,
                                10, 10, -30,
                                0, 0, 60
                        );
                        verts_push(
                                0, 0, -15,
                                -wingSpan_middle, 0, 0,//（第一个参数改了目测没变化,左右翼展改上面定义的upup）
                                0, 0, 15
                        );
                        verts_push(
                                0, 0, 15,
                                wingSpan_middle, 0, 0,
                                0, 0, -15
                        )
                }
                else {

                        verts_push(
                                0, -0, -50,
                                0, 4, -50,
                                0, 0, 90
                        );
                        verts_push(
                                0, 0, -15,
                                -wingSpan_large, 0, 0,//（第一个参数改了目测没变化,左右翼展改上面定义的upup）
                                0, 0, 15
                        );
                        verts_push(
                                0, 0, 15,
                                wingSpan_large, 0, 0,
                                0, 0, -15
                        )
                }
        }

        count = 0;
        index = 0;
        index2 = 0;

        var yanse = "rgb(255, 0, 0)";
        for (var v = 0; v < triangles * 3; v++) {

                // if(count == 9) {
                //         var clrs = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"];
                //         var idx = GetRandomNum(0, clrs.length - 1);
                //         yanse = clrs[idx];
                //         count = 0;
                // }
                // count++;

                var k = ~~(v / 3);
                var x = (k % WIDTH) / WIDTH;
                var y = ~~(k / WIDTH) / WIDTH;

                // console.log(yanse);
                var c = new THREE.Color(yanse);

                birdColors.array[v * 3 + 0] = c.r;
                birdColors.array[v * 3 + 1] = c.g;
                birdColors.array[v * 3 + 2] = c.b;

                references.array[v * 2] = x;
                references.array[v * 2 + 1] = y;

                birdVertex.array[v] = v % 9;
        }

        this.scale(0.3, 0.3, 0.3);
};

var Colors = {
        red:            0xf25346,       //飞机机身
        white:          0xd8d0d1,       //飞机机头
        brown:          0x59332e,       //目测是螺旋桨
        pink:           0xF5986E,       //远处的云
        brownDark:      0x23190f,       //机翼暗处
        blue:           0x1277ff,        //河（河调的light）
};

// -------------------------------------
//  LIGHTS
// -------------------------------------
var ambientLight, hemisphereLight, shadowLight;

function createLights() {

        hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
        shadowLight = new THREE.DirectionalLight(0xffffff, .9);
        shadowLight.position.set(150, 350, 350);
        shadowLight.castShadow = true;
        shadowLight.shadow.camera.left = -400;
        shadowLight.shadow.camera.right = 400;
        shadowLight.shadow.camera.top = 400;
        shadowLight.shadow.camera.bottom = -400;
        shadowLight.shadow.camera.near = 1;
        shadowLight.shadow.camera.far = 1000;
        shadowLight.shadow.mapSize.width = 2048;
        shadowLight.shadow.mapSize.height = 2048;
        // an ambient light modifies the global color of a scene and makes the shadows softer
        ambientLight = new THREE.AmbientLight(0xdc8874, .5);

        scene.add(ambientLight);
        scene.add(hemisphereLight);
        scene.add(shadowLight);
}

// -------------------------------------
//  SEA
// -------------------------------------
Sea = function () {
        //var geom = new THREE.CylinderGeometry(600,600,800,40,10);
        var geom = new THREE.CylinderGeometry(6000, 6000, 500, 500, 10);
        geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

        // important: by merging vertices we ensure the continuity of the waves
        geom.mergeVertices();

        // get the vertices
        var l = geom.vertices.length;

        // create an array to store new data associated to each vertex
        this.waves = [];

        for (var i = 0; i < l; i++) {
                // get each vertex
                var v = geom.vertices[i];

                // store some data associated to it
                this.waves.push({
                        y: v.y,
                        x: v.x,
                        z: v.z,
                        // a random angle
                        ang: Math.random() * Math.PI * 2,
                        // a random distance
                        amp: 0 + Math.random() * 15,
                        // a random speed between 0.016 and 0.048 radians / frame
                        speed: 0.006 + Math.random() * 0.032
                });
        }
        ;
        var mat = new THREE.MeshPhongMaterial({
                color: Colors.blue,
                transparent: true,
                opacity: 0.7,
                shading: THREE.FlatShading,
        });

        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.receiveShadow = true;

}

// now we create the function that will be called in each frame
// to update the position of the vertices to simulate the waves

Sea.prototype.moveWaves = function () {

        // get the vertices
        var verts = this.mesh.geometry.vertices;
        var l = verts.length;

        for (var i = 0; i < l; i++) {
                var v = verts[i];

                // get the data associated to it
                var vprops = this.waves[i];

                // update the position of the vertex
                v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
                v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

                // increment the angle for the next frame
                vprops.ang += vprops.speed;

        }

        // Tell the renderer that the geometry of the sea has changed.
        // In fact, in order to maintain the best level of performance,
        // three.js caches the geometries and ignores any changes
        // unless we add this line
        this.mesh.geometry.verticesNeedUpdate = true;

        sea.mesh.rotation.z += .0008;
}

function createSea() {
        sea = new Sea();
        sea.mesh.position.x = 0;
        sea.mesh.position.z = 40;
        sea.mesh.position.y = -6100;
//                sea.mesh.position.z = -100;//无关
        scene.add(sea.mesh);
}


THREE.BirdGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);


var container, stats;
var camera, scene, renderer, geometry, i, h, color;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2;

var last = performance.now();

var gpuCompute;
var velocityVariable;
var positionVariable;
var positionUniforms;
var velocityUniforms;
var birdUniforms;

function init() {

        container = document.getElementById('birdContainer');
//                document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.x = 0;
        camera.position.z = 350;
        camera.position.y = 0;

        scene = new THREE.Scene();

        //scene.fog = new THREE.Fog(0x000000, 100, 1000);
        scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
        //改背景颜色

        renderer = new THREE.WebGLRenderer({alpha: true, antialias: false});
        renderer.setClearColor(scene.fog.color, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight+300);
        container.appendChild(renderer.domElement);

        initComputeRenderer();

        stats = new Stats();
        // container.appendChild(stats.dom);

        // document.addEventListener('mousemove', onDocumentMouseMove, false);
        // document.addEventListener('touchstart', onDocumentTouchStart, false);
        // document.addEventListener('touchmove', onDocumentTouchMove, false);

        //

        window.addEventListener('resize', onWindowResize, false);


        var gui = new dat.GUI();


        var effectController = {
                seperation: 30.0,
                alignment: 40.0,
                cohesion: 0.8,
                freedom: 1.0
        };

        var valuesChanger = function () {

                velocityUniforms.seperationDistance.value = effectController.seperation;
                velocityUniforms.alignmentDistance.value = effectController.alignment;
                velocityUniforms.cohesionDistance.value = effectController.cohesion;
                velocityUniforms.freedomFactor.value = effectController.freedom;

        };

        valuesChanger();


        gui.add(effectController, "seperation", 0.0, 100.0, 1.0).onChange(valuesChanger);
        gui.add(effectController, "alignment", 0.0, 100, 0.001).onChange(valuesChanger);
        gui.add(effectController, "cohesion", 0.0, 100, 0.025).onChange(valuesChanger);
        gui.close();

        createLights();
        createSea();
        initBirds();
}

function initComputeRenderer() {

        gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

        var dtPosition = gpuCompute.createTexture();
        var dtVelocity = gpuCompute.createTexture();
        fillPositionTexture(dtPosition);
        fillVelocityTexture(dtVelocity);

        velocityVariable = gpuCompute.addVariable("textureVelocity", document.getElementById('fragmentShaderVelocity').textContent, dtVelocity);
        positionVariable = gpuCompute.addVariable("texturePosition", document.getElementById('fragmentShaderPosition').textContent, dtPosition);

        gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);
        gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);

        positionUniforms = positionVariable.material.uniforms;
        velocityUniforms = velocityVariable.material.uniforms;

        positionUniforms.time = {value: 0.0};
        positionUniforms.delta = {value: 0.0};
        velocityUniforms.time = {value: 1.0};
        velocityUniforms.delta = {value: 0.0};
        velocityUniforms.testing = {value: 1.0};
        velocityUniforms.seperationDistance = {value: 1.0};
        velocityUniforms.alignmentDistance = {value: 1.0};
        velocityUniforms.cohesionDistance = {value: 1.0};
        velocityUniforms.freedomFactor = {value: 1.0};
        velocityUniforms.predator = {value: new THREE.Vector3()};
        velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed(2);

        velocityVariable.wrapS = THREE.RepeatWrapping;
        velocityVariable.wrapT = THREE.RepeatWrapping;
        positionVariable.wrapS = THREE.RepeatWrapping;
        positionVariable.wrapT = THREE.RepeatWrapping;

        var error = gpuCompute.init();
        // if (error !== null) {
        //         console.error(error);
        // }

}

function initBirds() {

        var geometry = new THREE.BirdGeometry();

        // For Vertex and Fragment
        birdUniforms = {
                color: {
                        value: new THREE.Color(0xffff66)
                },
                texturePosition:
                        {
                                value: null
                        }
                ,
                textureVelocity: {
                        value: null
                }
                ,
                time: {
                        value: 1.0
                }
                ,
                delta: {

                        value: 0.0
                }
        }
        ;

        // ShaderMaterialÍ
        var material = new THREE.ShaderMaterial({
                uniforms: birdUniforms,
                vertexShader: document.getElementById('birdVS').textContent,
                fragmentShader: document.getElementById('birdFS').textContent,
                side: THREE.DoubleSide

        });

        birdMesh = new THREE.Mesh(geometry, material);
        birdMesh.rotation.y = Math.PI / 2;
        birdMesh.matrixAutoUpdate = false;
        birdMesh.updateMatrix();

        // scene.add(birdMesh);

}

function fillPositionTexture(texture) {

        var theArray = texture.image.data;

        for (var k = 0, kl = theArray.length; k < kl; k += 4) {

                var x = Math.random() * BOUNDS - BOUNDS_HALF;
                var y = Math.random() * BOUNDS - BOUNDS_HALF;
                var z = Math.random() * BOUNDS - BOUNDS_HALF;

                theArray[k + 0] = x;
                theArray[k + 1] = y;
                theArray[k + 2] = z;
                theArray[k + 3] = 1;

        }

}

function fillVelocityTexture(texture) {

        var theArray = texture.image.data;

        for (var k = 0, kl = theArray.length; k < kl; k += 4) {

                var x = Math.random() - 0.5;
                var y = Math.random() - 0.5;
                var z = Math.random() - 0.5;

                theArray[k + 0] = x * 10;
                theArray[k + 1] = y * 10;
                theArray[k + 2] = z * 10;
                theArray[k + 3] = 1;

        }

}


function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight+300);
}

function onDocumentMouseMove(event) {

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart(event) {

        if (event.touches.length === 1) {

                event.preventDefault();

                mouseX = event.touches[0].pageX - windowHalfX;
                mouseY = event.touches[0].pageY - windowHalfY;

        }

}

function onDocumentTouchMove(event) {

        if (event.touches.length === 1) {

                event.preventDefault();

                mouseX = event.touches[0].pageX - windowHalfX;
                mouseY = event.touches[0].pageY - windowHalfY;

        }

}

//

function animate() {

        requestAnimationFrame(animate);

        render();
        stats.update();

}

function render() {

        var now = performance.now();
        var delta = (now - last) / 1000;

        if (delta > 1) delta = 1; // safety cap on large deltas
        last = now;

        // For sea
        sea.moveWaves();
        sea.mesh.rotation.z += .00005;

        positionUniforms.time.value = now;
        positionUniforms.delta.value = delta;
        velocityUniforms.time.value = now;
        velocityUniforms.delta.value = delta;
        birdUniforms.time.value = now;
        birdUniforms.delta.value = delta;

        velocityUniforms.predator.value.set(0.5 * 0 / windowHalfX, -0.5 * 1100 / windowHalfY, 0);
        // console.log(mouseX + ", " + mouseY);

        mouseX = 10000;
        mouseY = 10000;

        gpuCompute.compute();

        birdUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
        birdUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;

        renderer.render(scene, camera);

}

function GetRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
}