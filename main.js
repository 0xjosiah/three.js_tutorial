import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { VertexColors } from 'three';


//dat.GUI section adds adjustable sliders
const gui = new dat.GUI()
const world = {
  plane: {
    width: 400, //change these to adjust initial scene on load
    height: 400, 
    widthSegments: 50,
    heightSegments: 50
  }
}
gui.add(world.plane, 'width', 1, 500).onChange(() => {
  generatePlane()
})
gui.add(world.plane, 'height', 1, 500).onChange(() => {
  generatePlane()
})
gui.add(world.plane, 'widthSegments', 1, 100).onChange(() => {
  generatePlane()
})
gui.add(world.plane, 'heightSegments', 1, 100).onChange(() => {
  generatePlane()
})

//this makes sliders work
function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
 
  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0,.19,.4)
  }

  planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
  
  // vertex position randomization
  const {array} = planeMesh.geometry.attributes.position //decontruts object
  const randomValues = []
  for (let i = 0; i < array.length; i++) {
    
    if (i % 3 === 0){
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

      array[i] = x + (Math.random() - 0.5) * 25
      array[i + 1] = y + (Math.random() - 0.5) * 50
      array[i + 2] = z + (Math.random() - .5) * 5
    }

    randomValues.push(Math.random() * Math.PI * 2)
  }


  planeMesh.geometry.attributes.position.randomValues = randomValues
  planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array

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
camera.position.z = 450 //by default camera is at same position as object in scene, this 'takes a step back'

const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments) //creates shape in scene (just a plane in this case)
const planeMaterial = new THREE.MeshPhongMaterial({ //material paints the shape
    // color: 0xff0000, 
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading, //allows light to interact with various z planes
    vertexColors: true //v might be capitalized if doesn't work
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial) //paraphrasing, but mesh combines the two and sets vertices (prolly wrong)
scene.add(planeMesh)

generatePlane()

const light = new THREE.DirectionalLight(0xffffff, 1) //provides light, phong material requires light
light.position.set(0, -1, 1) //x,y,z coordinates (right/left, up/down, forward/backward thru screen)
scene.add(light) //scene.add adds the argument to scene

const backLight = new THREE.DirectionalLight(0xffffff, 1) //provides light, phong material requires light
backLight.position.set(0, 0, -1) //x,y,z coordinates (right/left, up/down, forward/backward thru screen)
scene.add(backLight) //scene.add adds the argument to scene


const mouse = {
  x: undefined,
  y: undefined
}

let frame = 0
function animate () {
    requestAnimationFrame(animate) //when animate() called, creates loop so scene is constantly visible
    renderer.render(scene, camera)
    // planeMesh.rotation.y += .01
    raycaster.setFromCamera(mouse, camera)
    frame += 0.01

    const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position
    for(let i = 0; i < array.length; i += 3) {
      //x
      array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * .01
      //y
      array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * .01
      //z
      array[i + 2] = originalPosition[i + 2] + Math.cos(frame + randomValues[i + 2]) * .01
      
    }

    planeMesh.geometry.attributes.position.needsUpdate = true

    const intersects = raycaster.intersectObject(planeMesh)
    if(intersects.length > 0) {
      const {color} = intersects[0].object.geometry.attributes

      // vertex 1
      color.setX(intersects[0].face.a, .1)
      color.setY(intersects[0].face.a, .5)
      color.setZ(intersects[0].face.a, 1)

      // vertex 2
      color.setX(intersects[0].face.b, .1)
      color.setY(intersects[0].face.b, .5)
      color.setZ(intersects[0].face.b, 1)

      //vertex 3
      color.setX(intersects[0].face.c, .1)
      color.setY(intersects[0].face.c, .5)
      color.setZ(intersects[0].face.c, 1)

      intersects[0].object.geometry.attributes.color.needsUpdate = true

      const initialColor = {
        r: 0,
        g: .19,
        b: .4
      }

      const hoverColor = {
        r: .1,
        g: .5,
        b: 1
      }
      gsap.to(hoverColor, {
        r: initialColor.r,
        g: initialColor.g,
        b: initialColor.b,
        duration: 1,
        onUpdate: () => {
          // vertex 1
          color.setX(intersects[0].face.a, hoverColor.r)
          color.setY(intersects[0].face.a, hoverColor.g)
          color.setZ(intersects[0].face.a, hoverColor.b)

          // vertex 2
          color.setX(intersects[0].face.b, hoverColor.r)
          color.setY(intersects[0].face.b, hoverColor.g)
          color.setZ(intersects[0].face.b, hoverColor.b)

          //vertex 3
          color.setX(intersects[0].face.c, hoverColor.r)
          color.setY(intersects[0].face.c, hoverColor.g)
          color.setZ(intersects[0].face.c, hoverColor.b)
        }
      })
    }
}


animate() //required to render everything on page

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1

})

//STOPPED AT 2:12ish