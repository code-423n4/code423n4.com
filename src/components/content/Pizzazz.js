import React, { useEffect } from "react";
import * as THREE from "three";
import SimplexNoise from "simplex-noise";

// Modied from https://codepen.io/soju22/pen/PLeLwo
// by @soju22
// Copyright (c) 2019 by Kevin Levron (https://codepen.io/soju22/pen/PLeLwo)

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const Pizzazz = () => {
  function App({ conf }) {
    conf = {
      fov: 75,
      cameraZ: 75,
      xyCoef: 50,
      zCoef: 15,
      lightIntensity: 0.2,
      ambientColor: 0x000000,
      light1Color: 0x7549ff,
      light2Color: 0x473dff,
      light3Color: 0x4d22c7,
      light4Color: 0xee3bcf,
      ...conf,
    };

    let renderer, scene, camera;
    let width, height, wWidth, wHeight, cx, cy;
    let light1, light2, light3, light4;
    let gArray;

    let plane;
    const simplex = new SimplexNoise();
    const mouse = new THREE.Vector2();
    init();

    function init() {
      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("background"),
        antialias: true,
        alpha: true,
      });
      camera = new THREE.PerspectiveCamera(conf.fov);
      camera.position.z = conf.cameraZ;

      updateSize();
      window.addEventListener("resize", updateSize, false);

      initScene();
      animate();
    }

    function initScene() {
      scene = new THREE.Scene();
      initLights();

      let mat = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });

      let geo = new THREE.PlaneGeometry(
        wWidth,
        wHeight,
        wWidth / 2,
        wHeight / 2
      );
      plane = new THREE.Mesh(geo, mat);
      scene.add(plane);

      plane.rotation.x = -Math.PI / 2 - 0.2;
      plane.position.y = -25;
      camera.position.z = 60;
    }

    function initLights() {
      const r = 30;
      const y = 10;
      const lightDistance = 500;

      light1 = new THREE.PointLight(
        conf.light1Color,
        conf.lightIntensity,
        lightDistance
      );
      light1.position.set(0, y, r);
      scene.add(light1);
      light2 = new THREE.PointLight(
        conf.light2Color,
        conf.lightIntensity,
        lightDistance
      );
      light2.position.set(0, -y, -r);
      scene.add(light2);
      light3 = new THREE.PointLight(
        conf.light3Color,
        conf.lightIntensity,
        lightDistance
      );
      light3.position.set(r, y, 0);
      scene.add(light3);
      light4 = new THREE.PointLight(
        conf.light4Color,
        conf.lightIntensity,
        lightDistance
      );
      light4.position.set(-r, y, 0);
      scene.add(light4);
    }

    function animate() {
      requestAnimationFrame(animate);
      animatePlane();
      animateLights();
      renderer.render(scene, camera);
    }

    function animatePlane() {
      gArray = plane.geometry.attributes.position.array;
      const time = Date.now() * 0.0002;
      for (let i = 0; i < gArray.length; i += 3) {
        gArray[i + 2] =
          simplex.noise4D(
            gArray[i] / conf.xyCoef,
            gArray[i + 1] / conf.xyCoef,
            time,
            mouse.x + mouse.y
          ) * conf.zCoef;
      }
      plane.geometry.attributes.position.needsUpdate = true;
    }

    function animateLights() {
      const time = Date.now() * 0.001;
      const d = 50;
      light1.position.x = Math.sin(time * 0.1) * d;
      light1.position.z = Math.cos(time * 0.2) * d;
      light2.position.x = Math.cos(time * 0.3) * d;
      light2.position.z = Math.sin(time * 0.4) * d;
      light3.position.x = Math.sin(time * 0.5) * d;
      light3.position.z = Math.sin(time * 0.6) * d;
      light4.position.x = Math.sin(time * 0.7) * d;
      light4.position.z = Math.cos(time * 0.8) * d;
    }

    function updateSize() {
      width = window.innerWidth;
      // cx = width / 2;
      height = 170;
      // cy = height / 2;
      if (renderer && camera) {
        renderer.setSize(width, height);
        camera.aspect = width / (height * 2.8);
        camera.updateProjectionMatrix();
        const wsize = getRendererSize();
        wWidth = wsize[0];
        wHeight = wsize[1];
      }
    }

    function getRendererSize() {
      const cam = new THREE.PerspectiveCamera(camera.fov, camera.aspect);
      const vFOV = (cam.fov * Math.PI) / 180;
      const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
      const width = height * cam.aspect;
      return [width, height];
    }
  }

  useEffect(() => {
    if (window.innerWidth > 600) {
      App({ conf: "background" });
    }
  }, []);

  return (
    <div id="pizzazz__container">
      <canvas id="background"></canvas>
    </div>
  );
};

export default Pizzazz;
