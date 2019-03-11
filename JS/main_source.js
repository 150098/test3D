var scene = new THREE.Scene(); 새로운 공간을 만든다.
var camera = new THREE.PerspectiveCamera( main_source_fov, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({antialias:true, alpha:true}); 렌더러 선택
document.body.appendChild( renderer.domElement );

// instantiate a loader
var loader = new THREE.OBJLoader();
var texture = new THREE.TextureLoader().load( main_source + ".png" );
var main_source_mat = new THREE.MeshBasicMaterial( {map : texture} );
var obj = new THREE.Group();

// load a resource
// loader.load(1: 경로 상 파일, 2: 파일을 불러왔을 때 실행할 함수(1의 결과물))
loader.load(
	// resource URL
    // ex) source/dyson_aircleaner.obj
	main_source + ".obj",
	// called when resource is loaded
	function ( object ) {
        // object를 훑어본다 (훑어보는 과정 중 실행할 함수 (obj 코드 한 줄))
		object.traverse(

            // Child(obj 코드 한 줄마다)에서 Mesh가 발견되면 Threejs의 Mesh로 변경
            function (child){
                if (child instanceof THREE.Mesh){
                    child.material = main_source_mat;
                    // THREE.Group.add 기능을 실행
                    obj.add(child);
                    scene.add(obj);
                }
            }
        );
	}
);

// 배경 설정
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(main_source_bg);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.gammaFactor = 0;

// 격자 설정
if (OnGrid == 1){
    scene.add( new THREE.GridHelper( 1000, 1000 ) );
}

// 마우스 컨트롤 추가
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.autoRotate = true;
controls.enableDamping = true;
controls.screenSpacePaning = true;
controls.minDistance = main_source_zoom_min;
controls.maxDistance = main_source_zoom_max;
controls.rotateSpeed = main_source_rotate_speed_mouse;
controls.panSpeed = main_source_pan_speed;
controls.autoRotateSpeed = main_source_rotate_speed_auto;
controls.maxPolarAngle = Math.PI/2;

// 카메라 및 위치 설정
obj.position.y = main_source_y;
obj.scale.set(main_source_scale, main_source_scale, main_source_scale);
camera.position.set (main_camera_x, main_camera_y, main_camera_z);
camera.add(new THREE.AmbientLight(0xffffff));

// 배경 이미지 설정
if (main_bg != ""){
    var BG = new THREE.TextureLoader().load("../" + main_bg + ".png");
    scene.background = BG;
}

// 윈도우 리사이징 시
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// 프레임 당 재생
var animate = function () {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
};

animate();
