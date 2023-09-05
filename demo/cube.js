import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js'

const loader = new THREE.ObjectLoader()

//scene
const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-0.9, 0.9, 0.9, -0.9, 1, 1000)

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


function clampRadians(number) {
	return Math.abs(number) > 6.28 ? number % 6.28 : number
}


function onTouchMove(event) {
	event.preventDefault()
	const diffX = event.touches[0].clientX - x
	const diffY = event.touches[0].clientY - y
	x = event.touches[0].clientX
	y = event.touches[0].clientY
	if (!(Math.abs(diffX) > 20 || Math.abs(diffY) > 20)) {
		const newX = clampRadians(cube.rotation.x + diffY * 0.01)
		const newY = clampRadians(cube.rotation.y + diffX * 0.01)
		cube.rotation.x = newX
		cube.rotation.y = newY
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

const threeMinutes = 60 * 1000 * 3

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

		function orient() {
			const [x, y] = document.getElementById('cubeName').getAttribute('data-orientation').split('|')
			const frames = 24;
			const currentX = cube.rotation.x
			const currentY = cube.rotation.y
			const xIncrease = (x - cube.rotation.x) / 24
			const yIncrease = (y - cube.rotation.y) / 24
			let frameCount = 0;

			function step(newX, newY) {
				cube.rotation.x = Number(newX)
				cube.rotation.y = Number(newY)
				frameCount++;

				setTimeout(() => {
					window.requestAnimationFrame(() => {
						renderer.render(scene, camera)
					})

					if (frameCount < 24) {
						step(newX + xIncrease, newY + yIncrease)
					}
				}, 1000 / frames)
			}

			step(currentX + xIncrease, currentY + yIncrease)



			const message = document.createElement('div')
			message.setAttribute('class', 'hint')
			message.innerText = 'This is the correct cube position. Now look through it.'
			document.body.appendChild(message)
		}


		function listen() {
			window.addEventListener('mousedown', onClick, false)
			window.addEventListener('mouseup', onRelease, false)
			window.addEventListener('touchstart', onTouchStart, false)
			window.addEventListener('touchend', onTouchEnd, false)
		}

		if (localStorage.getItem(cubeName)) {
			const time = Date.now() - localStorage.getItem(cubeName)
			if (time > threeMinutes) {
				orient()
			} else {
				listen()
				setTimeout(() => {
					orient();
					window.removeEventListener('mousedown', onClick)
					window.removeEventListener('mouseup', onRelease)
					window.removeEventListener('touchstart', onTouchStart)
					window.removeEventListener('touchend', onTouchEnd)
				}, threeMinutes - time)
			}
		} else {
			listen()
			localStorage.setItem(cubeName, Date.now().toString())
		}

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


const secret = document.getElementById('secret');

if (secret) {
	document.addEventListener('input', (e) => {
		if (e.target.value.toLowerCase().replaceAll(' ', '') === 'nailsonachalkboard') {
			window.location.href = 'https://youtu.be/sgDWYblsZGw'
		}
	})
}