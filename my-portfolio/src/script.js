import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TextureLoader } from 'three'
import gsap from 'gsap'
// import glsl from 'glslify'
import { WebGLShader } from 'three'

// Native JS text
var tl = gsap.timeline({ repeat: -1 });
tl.to("h1", 30, { backgroundPosition: "-960px 0" });


const textureLoader = new THREE.TextureLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x010113 );

// Objects
const geometry = new THREE.PlaneBufferGeometry(1, 1.3)

for(let i = 0; i < 4; i++) {
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`/photos/${i}.jpg`)
    })

    const img = new THREE.Mesh(geometry, material)
    img.position.set(1.5, i*-1.7)

    scene.add(img)
}

let objects = []
scene.traverse((object) => {
    if(object.isMesh)
        objects.push(object)
        console.log(object)
})

// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

// Materials

// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xff0000)

// Mesh
// const sphere = new THREE.Mesh(geometry,material)
// scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

gui.add(camera.position, 'y').min(-5).max(10)


// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Mouse
window.addEventListener("wheel", onMouseWheel)

let y = 0
let position = 0

function onMouseWheel(event) {
    // console.log(event.deltaY)
    y = event.deltaY * -0.0009
}

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1 // width of browser
    mouse.y = - (event.clientY / sizes.height) * 2 + 1 // height of browser
    // console.log(event.clientX / sizes.width * 2 - 1)
})

/**
 * Animate
 */
const raycaster = new THREE.Raycaster()

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    // Update objects
    position += y
    y *= 0.9

    // Raycaster
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objects)
    // console.log(intersects)

    for(const intersect of intersects) {
        // console.log('intersected')
        gsap.to(intersect.object.scale, {x: 1.5, y: 1.5})
        gsap.to(intersect.object.rotation, {y: -0.3})
        gsap.to(intersect.object.position, {z: -0.9})


        // intersect.object.scale.set(1.1, 1.1)
    }

    for(const object of objects) {
        if(!intersects.find(intersect => intersect.object === object)) {
            // console.log('test')
            // object.scale.set(1, 1)
            gsap.to(object.scale, {x: 1, y: 1})
            gsap.to(object.rotation, {y: 0})
            gsap.to(object.position, {z: 0})
        }
    }

    camera.position.y = position
    // sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()