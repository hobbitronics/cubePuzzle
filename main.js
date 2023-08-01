import * as THREE from "three";

//scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({});
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const light = new THREE.PointLight(0xffffff, 1, 100);
const cube = new THREE.Mesh(geometry, material);

camera.position.z = 5;
renderer.setSize(window.innerWidth, window.innerHeight);
light.position.set(0, 10, 10);
scene.add(light);
scene.add(cube);

document.body.appendChild(renderer.domElement);

// function animate() {
//   requestAnimationFrame(animate);
//   cube.rotation.x += Math.random() * 0.1;
//   cube.rotation.y += 0.01;
renderer.render(scene, camera);
// }
// animate();

//rotate the camera when the mouse moves
function onMouseMove(event) {
  let x = 0;
  let y = 0;
  x = event.clientX;
  y = event.clientY;
  cube.rotation.x = y * 0.01;
  cube.rotation.y = x * -0.01;
  renderer.render(scene, camera);
}
function onTouchMove(event) {
  event.preventDefault();
  let x = 0;
  let y = 0;
  x = event.touches[0].clientX;
  y = event.touches[0].clientY;
  cube.rotation.x = y * 0.01;
  cube.rotation.y = x * -0.01;
  renderer.render(scene, camera);
}
const onClick = () => window.addEventListener("mousemove", onMouseMove, false);
const onRelease = () =>
  window.removeEventListener("mousemove", onMouseMove, false);
const onTouchStart = () =>
  window.addEventListener("touchmove", onTouchMove, false);
const onTouchEnd = () =>
  window.removeEventListener("touchmove", onTouchMove, false);

window.addEventListener("mousedown", onClick, false);
window.addEventListener("mouseup", onRelease, false);
window.addEventListener("touchstart", onTouchStart, false);
window.addEventListener("touchend", onTouchEnd, false);
