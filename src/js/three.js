import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'

const dragon = new URL('../assets/dragon.glb', import.meta.url);
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();


// 렌더링 스텝
// 1 스켈레톤 (골격) 을 만들고 -> 2 재질을 선택해 입히고 (material) -> 3  형태를 구현한다 (mesh)

// 렌더시킬 화면 크기 설정 후 화면에 보여줌
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement)

// 카메라의 fov 값과 카메라에서 보여질 화면 크기 , 최소 거리와 최대 거리 설정
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1,1000)

// 궤도 컨트롤을 사용하면 마우스 휠과 클릭 이벤트로 해당 축을 중점으로 화면을 돌릴 수 있다.
const orbit = new OrbitControls(camera, renderer.domElement)

// x , y , z 축 헬퍼함수
const axesHelper = new THREE.AxesHelper(3)


// 안개
// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
// 안개에 밀도를 더한다.
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01)
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    stars,
    stars,
    stars,
    stars,
    stars,
    stars
])

const box2Geometry = new THREE.BoxGeometry(10,10,10);
const box2Material = new THREE.MeshBasicMaterial();
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map : textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map : textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map : textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map : textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map : textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map : textureLoader.load(stars)}),
]
const box2 = new THREE.Mesh(box2Geometry,box2MultiMaterial)
scene.add(box2);
box2.position.set(0,15,10)

const plane2Geometry = new THREE.PlaneGeometry(10,10,10,10);
const plane2Material = new THREE.MeshBasicMaterial({
    color : 0xFFFFFF,
    wireframe : true
})
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material)
scene.add(plane2);
plane2.position.set(10,10,15);　
plane2.geometry.attributes.position.array[0]  -= 10 * Math.random();
plane2.geometry.attributes.position.array[1]  -= 10 * Math.random();
plane2.geometry.attributes.position.array[2]  -= 10 * Math.random();

const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ]  -= 10 * Math.random();
// GUI 라이브러리
const gui = new dat.GUI();

// 보여줄 화면에 에셋 추가
scene.add(axesHelper);

const planeGeometry = new THREE.PlaneGeometry(100,100)
const planeMaterial = new THREE.MeshStandardMaterial({color : 0xFFFFFF, side : THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

const gridHelper = new THREE.GridHelper(100);
scene.add(gridHelper);
scene.add(plane);
// receiveShadow 는 다른 객체의 그림자를 전달 받는다.
// castShadow 는 빛에 의해 객체에 그림자를 받도록한다.
plane.receiveShadow = true;

plane.rotation.x = Math.PI / -2;

// 카메라 위치 설정
// 카메라 위치가 변경될대마다 궤도를 업데이트 해줘야함
camera.position.set(-10,30,30);
orbit.update();

// 박스 형태 , 질감 설정 후 화면에 추가
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({color : 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const sphereGeometry = new THREE.SphereGeometry(4, 50,50);
const sphereMaterial = new THREE.MeshStandardMaterial({color : '#ffea00', wireframe: false})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere);
sphere.castShadow = true;
sphere.position.set(-10,10,0)

// 주변광을 깔아준다.
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight)

// // 방향조명을 깔아서 빛의 위치를 정한다.
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8)
// scene.add(directionalLight);
//
//
//
// directionalLight.position.set(-30,50,0)
// directionalLight.castShadow = true;
//
// // 여기서는 방향조명의 카메라 위치를 변경해서 모든 세그먼트가 객체를 받을 수 있게 한다.
// directionalLight.shadow.camera.bottom = -12;
//
// const dLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
// scene.add(dLightHelper);
//
// // 방향 조명의 그림자 카메라 헬퍼를 등록한다.
// // 항상 헬퍼가 존재해야하는 이유는 렌더링 시 정확히 어떻게 표현되는지, 어떻게 위치하는지 모르기때문에 가이드가 필요하다.
// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)


// 스포트라이트를 생성한다.
const spotLight = new THREE.SpotLight(0xFFFFFF, 0.8);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0)
spotLight.castShadow = true;
spotLight.angle = 0.2;
// 스포트라이트 헬퍼 생성
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const assetLoader = new GLTFLoader();
assetLoader.load(dragon.href, (gltf)=>{
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-35,0,-20);
}, undefined, (e)=>{
    console.log(e);
})

const options = {
    sphereColor : '#ffea00',
    wireframe : false,
    speed : 0.01,
    angle : 0.2,
    penumbra : 0,
    intensity : 1
}

// gui 탭 생성을 하는데 그중 컬러옵션을 활성화 하고 ,
// 필요한 옵션 초기값을 세팅 후 onChange 이벤트로 변경하고자하는 도형에 값을 변경시킴
gui.addColor(options, 'sphereColor').onChange((e) => {
    sphere.material.color.set(e);
})

// 어떤 옵션이든 해당 텍스처에서 지원하는 옵션은 프로터와 onChange 로 추가 및 값 변경 가능
gui.add(options, 'wireframe').onChange((e)=>{
    sphere.material.wireframe = e;
})

// 가속도 의 경우 onChange 가 필요없다
gui.add(options, 'speed',0,0.1);

gui.add(options, 'angle',0,1);
gui.add(options, 'penumbra',0,1);
gui.add(options, 'intensity',0,1);


let step = 0; // 스텝

const mousePosition = new THREE.Vector2();

window.addEventListener(('mousemove'), (e)=>{
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
})

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;
box2.name = 'theBox';

function animation(time){
    box.rotation.x = time / 1000
    box.rotation.y = time / 1000;

    // 루프를 돌면서 gui 에서 설정하는 값만큼 step 에 쌓아준다.
    step += options.speed;
    // 구의 y 값을 계산하고 sin 값에 step 을 추가해서 구를 튀게 만듬
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);

    for (const element of intersects) {
        if (element.object.id === sphereId) {
            element.object.material.color.set(0xFF0000);
        }

        if (element.object.name === 'theBox'){
            element.object.rotation.x = time / 1000;
            element.object.rotation.y = time / 1000;
        }
    }

    plane2.geometry.attributes.position.array[0]  = 10 * Math.random();
    plane2.geometry.attributes.position.array[1]  = 10 * Math.random();
    plane2.geometry.attributes.position.array[2]  = 10 * Math.random();
    plane2.geometry.attributes.position.array[lastPointZ]  = 10 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animation)

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
})
