import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'
import { VertexColors } from 'three';


//dat.GUI section adds adjustable sliders
const gui = new dat.GUI()
const world = {
  plane: {
    width: 10,
    height: 10, 
    widthSegments: 10,
    heightSegments: 10
  }
}
gui.add(world.plane, 'width', 1, 20).onChange(() => {
  generatePlane()
})
gui.add(world.plane, 'height', 1, 20).onChange(() => {
  generatePlane()
})
gui.add(world.plane, 'widthSegments', 1, 50).onChange(() => {
  generatePlane()
})
gui.add(world.plane, 'heightSegments', 1, 50).onChange(() => {
  generatePlane()
})

//this makes sliders work
function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
  const {array} = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]
      array[i + 2] = z + Math.random()
  }
}

//three requirements to set 'stage'
const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()


renderer.setSize(innerWidth, innerHeight) //sets scene to full screen w & h
renderer.setPixelRatio(devicePixelRatio) //sets scene pixel density to same as device (curbs jagged edges)
document.body.appendChild(renderer.domElement) 

new OrbitControls(camera, renderer.domElement) //creates orbit controls (allows you to move camera)
camera.position.z = 5 //by default camera is at same position as object in scene, this 'takes a step back'

const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10) //creates shape in scene (just a plane in this case)
const planeMaterial = new THREE.MeshPhongMaterial({ //material paints the shape
    // color: 0xff0000, 
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading, //allows light to interact with various z planes
    vertexColors: true //v might be capitalized if doesn't work
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial) //paraphrasing, but mesh combines the two and sets vertices (prolly wrong)
scene.add(planeMesh)

const light = new THREE.DirectionalLight(0xffffff, 1) //provides light, phong material requires light
light.position.set(0, 0, 1) //x,y,z coordinates (right/left, up/down, forward/backward thru screen)
scene.add(light) //scene.add adds the argument to scene

const backLight = new THREE.DirectionalLight(0xffffff, 1) //provides light, phong material requires light
backLight.position.set(0, 0, -1) //x,y,z coordinates (right/left, up/down, forward/backward thru screen)
scene.add(backLight) //scene.add adds the argument to scene

console.log(planeMesh.geometry.attributes)

const {array} = planeMesh.geometry.attributes.position //decontruts object
for (let i = 0; i < array.length; i += 3) {
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]
    array[i + 2] = z + Math.random()
}

const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0,0,1)
}
console.log(colors)

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

const mouse = {
  x: undefined,
  y: undefined
}

function animate () {
    requestAnimationFrame(animate) //when animate() called, creates loop so scene is constantly visible
    renderer.render(scene, camera)
    
    // planeMesh.rotation.y += .01
    
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(planeMesh)
    if(intersects.length > 0) {
      
    }
}


animate() //required to render everything on page

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1

})


//STOPPED AT 1:30ish