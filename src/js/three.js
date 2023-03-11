import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();


// 렌더링 스텝
// 1 스켈레톤 (골격) 을 만들고 -> 2 재질을 선택해 입히고 (material) -> 3  형태를 구현한다 (mesh)

// 렌더시킬 화면 크기 설정 후 화면에 보여줌
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// 카메라의 fov 값과 카메라에서 보여질 화면 크기 , 최소 거리와 최대 거리 설정
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1,1000)

// 궤도 컨트롤을 사용하면 마우스 휠과 클릭 이벤트로 해당 축을 중점으로 화면을 돌릴 수 있다.
const orbit = new OrbitControls(camera, renderer.domElement)

// x , y , z 축 헬퍼함수
const axesHelper = new THREE.AxesHelper(3)

// 보여줄 화면에 에셋 추가
scene.add(axesHelper);

const planeGeometry = new THREE.PlaneGeometry(30,30)
const planeMaterial = new THREE.MeshBasicMaterial({color : 0xFFFFFF})
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
const gridHelper = new THREE.GridHelper();
scene.add(gridHelper);
scene.add(plane);

// 카메라 위치 설정
// 카메라 위치가 변경될대마다 궤도를 업데이트 해줘야함
camera.position.set(-10,30,30);
orbit.update();

// 박스 형태 , 질감 설정 후 화면에 추가
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color : 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);


function animation(time){
    box.rotation.x = time / 1000
    box.rotation.y = time / 1000;
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animation)
