import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import * as dat from 'dat.gui'
console.log(dat)

//54
//three requirements to set 'stage'
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()


renderer.setSize(innerWidth, innerHeight) //sets scene to full screen w & h
renderer.setPixelRatio(devicePixelRatio) //sets scene pixel density to same as device (curbs jagged edges)
document.body.appendChild(renderer.domElement) 

camera.position.z = 5 //by default camera is at same position as object in scene, this 'takes a step back'

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10) //creates shape in scene (just a plane in this case)
const planeMaterial = new THREE.MeshPhongMaterial({ //material paints the shape
    color: 0xff0000, 
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading //allows light to interact with various z planes
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial) //paraphrasing, but mesh combines the two and sets vertices (prolly wrong)
const light = new THREE.DirectionalLight(0xffffff, 1) //provides light, phong material requires light

light.position.set(0, 0, 1) //x,y,z coordinates (right/left, up/down, forward/backward thru screen)
scene.add(light) //scene.add adds the argument to scene

scene.add(planeMesh)


const {array} = planeMesh.geometry.attributes.position

for (let i = 0; i < array.length; i += 3) {
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]

    array[i + 2] = z + Math.random()
}

function animate () {
    requestAnimationFrame(animate) //when animate() called, creates loop so scene is constantly visible
    renderer.render(scene, camera)
    // planeMesh.rotation.y += .01
}


animate() //required to render everything on page