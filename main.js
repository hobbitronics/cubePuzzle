import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js'

const loader = new THREE.ObjectLoader()

//scene
const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000)

let cube
const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setClearColor(0x000000, 0)

camera.position.z = 5
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight)

renderer.setClearColor(0x000000, 0);
renderer.shadowMapType = THREE.PCFSoftShadowMap;

camera.position.z = 5;
const size = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
renderer.setSize(size, size);



const video = document.getElementById('video')

navigator.mediaDevices
  .getUserMedia({
    video: {
      facingMode: 'environment',
    },
    audio: false,
  })
  .then((stream) => {
    video.srcObject = stream
    video.play()
    function play() {
      video.play()
      document.body.removeEventListener('click', play)
    }
    document.body.addEventListener('click', play)
  })
  .catch((err) => {
    console.error(`An error occurred: ${err}`)
  })

document.body.appendChild(renderer.domElement)

//rotate the cube when the mouse moves
let x = 0
let y = 0
function onMouseMove(event) {
  const diffX = event.clientX - x
  const diffY = event.clientY - y
  x = event.clientX
  y = event.clientY
  if (!(Math.abs(diffX) > 20 || Math.abs(diffY) > 20)) {
    console.log(diffX, diffY)
    cube.rotation.x += diffY * 0.01
    cube.rotation.y += diffX * 0.01
    window.requestAnimationFrame(() => {
      renderer.render(scene, camera)
    })
  }
}


function onTouchMove(event) {
  event.preventDefault()
  const diffX = event.touches[0].clientX - x
  const diffY = event.touches[0].clientY - y
  x = event.touches[0].clientX
  y = event.touches[0].clientY
  if (!(Math.abs(diffX) > 20 || Math.abs(diffY) > 20)) {
    cube.rotation.x += diffY * 0.01
    cube.rotation.y += diffX * 0.01
    renderer.render(scene, camera)
  }
}

const onClick = () => window.addEventListener('mousemove', onMouseMove, false)
const onRelease = () =>
  window.removeEventListener('mousemove', onMouseMove, false)
const onTouchStart = () =>
  window.addEventListener('touchmove', onTouchMove, { passive: false })
const onTouchEnd = () =>
  window.removeEventListener('touchmove', onTouchMove, { passive: false })

const cubeName = document.getElementById('cubeName').value
console.log(`loading ${cubeName}`)

loader.load(
  cubeName,

  // onLoad callback
  function (obj) {
    cube = obj
    // Add the loaded object to the scene
    const light = new THREE.DirectionalLight(0xffffff, 4);
    scene.add(light);
    scene.add(cube);
    light.target = cube;
    light.castshadow = true;
    light.position.set(10, 10, 10);

    if (WebGL.isWebGLAvailable()) {
      renderer.render(scene, camera)
    } else {
      const warning = WebGL.getWebGLErrorMessage()
      document.getElementById('container').appendChild(warning)
    }

    window.addEventListener('mousedown', onClick, false)
    window.addEventListener('mouseup', onRelease, false)
    window.addEventListener('touchstart', onTouchStart, false)
    window.addEventListener('touchend', onTouchEnd, false)
  },

  // onProgress callback
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },

  // onError callback
  function (err) {
    console.error('An error happened')
  }
)
