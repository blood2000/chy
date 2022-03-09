import ThreeMap from './ThreeMap';
import img1 from './images/lightray.png';
import img2 from './images/lightray_yellow.jpg';
import throttle from 'lodash.throttle';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
const bgMsg = require('@/threeMap/images/bg-msg.png');
const iconMsg = require('@/threeMap/images/icon-msg.png');

export default class ThreeMapLightBar extends ThreeMap {
  constructor(set) {
    super(set);
    this.dataKeys = {};
    this.setDataKeys();
    this.colors = ['#fff', '#ff0'];
    this.colorIndex = 0;
    this.textures = [new THREE.TextureLoader().load(img1)];
    this.pointsLength = 20;
  }

  // 设置键值
  setDataKeys() {
    this.mapData.features.forEach(d => {
      const { name, cp } = d.properties;
      this.dataKeys[name] = [...cp];
    });

    console.log(this.dataKeys);
  }

  /**
   * @desc 节流，防抖
   */
  doAnimate = throttle(() => {
    const ratio = this.colorIndex / this.pointsLength;

    this.flyGroup &&
      this.flyGroup.children.forEach((d) => {
        var colors = [];
        var color = new THREE.Color();
        for (var j = 0; j < this.pointsLength; j++) {
          if (j !== this.colorIndex) {
            color.setStyle('#005fc4');
            colors.push(color.r, color.g, color.b);
          } else {
            color.setStyle('#00f3ff');
            colors.push(color.r, color.g, color.b);
          }
        }

        d.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3, true));
        d.geometry.colorsNeedUpdate = true;
      });

    this.sixLineGroup &&
      this.sixLineGroup.children.forEach(d => {
        d.scale.set(1 + ratio, 1 + ratio, d.scale.z);
        d.material.opacity = 1 - ratio;
      });

    this.colorIndex++;
    if (this.colorIndex > this.pointsLength - 1) {
      this.colorIndex = 0;
    }
  }, 30);

  /**
   * @desc 绘制6边形
   */
  drawSixMesh(x, y, z, i, size = 32) {
    const geometry = new THREE.CircleGeometry(0.4, size);
    const material = new THREE.MeshBasicMaterial({ color: '#018ff2' });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z + 0.1);
    return mesh;
  }

  /**
   * @desc 绘制6边线
   */
  drawSixLineLoop(x, y, z, i) {
    // 绘制六边型
    const geometry = new THREE.CircleGeometry(0.45, 32, 0, 2 * Math.PI);
    const material = new THREE.MeshBasicMaterial({ color: '#018ff2', transparent: true });
    // geometry.vertices.shift();
    const line = new THREE.LineLoop(geometry, material);
    line.position.set(x, y, z + 0.1);
    return line;
  }

  drawPointLabel(x, y, z, value, i) {
    const hei = value / 10;
    var msgBar = document.createElement('div');
    var msgInner = document.createElement('div');
    var msgIcon = document.createElement('div');
    var msgTxt = document.createElement('div');
    var msgStatus = document.createElement('div');

    msgBar.classList.add('mas-bar');
    msgBar.style.width = '235px';
    msgBar.style.height = '66px';
    msgBar.style.display = 'flex';
    msgBar.style.justifyContent = 'center';
    msgBar.style.alignItems = 'center';
    msgBar.style.backgroundImage = `url(${bgMsg})`;
    msgBar.style.backgroundRepeat = `no-repeat`;
    msgBar.style.backgroundSize = `cover`;
    msgBar.style.padding = `8px`;
    msgInner.classList.add('msg-inner');
    msgInner.style.width = '220px';
    msgInner.style.height = '50px';
    msgInner.style.padding = '0 10px';
    msgInner.style.display = 'flex';
    msgInner.style.alignItems = 'center';
    msgInner.style.justifyContent = 'space-between';
    msgIcon.classList.add('msg-icon');
    msgIcon.innerHTML = '卸';
    msgIcon.style.width = '35px';
    msgIcon.style.height = '35px';
    msgIcon.style.backgroundSize = 'cover';
    msgIcon.style.display = 'flex';
    msgIcon.style.justifyContent = 'center';
    msgIcon.style.alignItems = 'center';
    msgIcon.style.marginRight = '10px';
    msgIcon.style.flexShrink = '0';
    msgIcon.style.fontFamily = 'Pangmen';
    msgIcon.style.fontSize = '20px';
    msgIcon.style.backgroundImage = `url(${iconMsg})`;
    msgIcon.style.backgroundRepeat = `no-repeat`;
    msgIcon.style.backgroundSize = `cover`;
    msgInner.appendChild(msgIcon);

    msgTxt.classList.add('msg-txt');
    msgTxt.style.width = '100%';
    msgTxt.style.flexShrink = '1';
    var span1 = document.createElement('span');
    span1.innerHTML = '吴敬东 闽A510AY';
    span1.style.fontSize = '14px';
    span1.style.color = '#fff';
    span1.style.lineHeight = '1.4';
    span1.style.display = 'block';
    var span2 = document.createElement('span');
    span2.classList.add('time');
    span2.innerHTML = '14:26:25';
    span2.style.fontSize = '12px';
    span2.style.color = '#bdc4d7';
    span2.style.display = 'block';
    msgTxt.appendChild(span1);
    msgTxt.appendChild(span2);
    msgInner.appendChild(msgTxt);


    msgStatus.classList.add('msg-status');
    msgStatus.innerHTML = '卸货';
    msgStatus.style.color = '#01e1fd';
    msgStatus.style.fontSize = '14px';
    msgStatus.style.flexShrink = '0';
    msgInner.appendChild(msgStatus);

    msgBar.appendChild(msgInner);

    var moonLabel = new CSS2DObject(msgBar);
    moonLabel.position.set(x, y, z + hei + 1);
    return moonLabel;
  }

  /**
   * @desc 柱子
   */
  drawPlane(x, y, z, value, i) {
    const hei = value / 10;
    const geometry = new THREE.PlaneGeometry(1, hei);
    const material = new THREE.MeshBasicMaterial({
      map: this.textures[0],
      depthTest: false,
      transparent: true,
      color: this.colors[i % 2],
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(x, y, z + hei / 2);
    plane.rotation.x = Math.PI / 2;
    plane.rotation.z = Math.PI;
    const plane2 = plane.clone();
    plane2.rotation.y = Math.PI / 2;
    return [plane, plane2];
  }

  /**
   * @desc 绘制光柱
   */
  drawLightBar(data) {
    const group = new THREE.Group();
    const sixLineGroup = new THREE.Group();
    data.forEach((d, i) => {
      const lnglat = this.dataKeys[d.name];
      const [x, y, z] = this.lnglatToMector(lnglat);

      // 绘制六边体
      group.add(this.drawSixMesh(x, y, z, i));
      // 绘制6边线
      sixLineGroup.add(this.drawSixLineLoop(x, y, z, i));
      // 绘制自定义DIV
      // pointLabelGroup.add(this.drawPointLabel(x, y, z, i));

      // 绘制柱子
      const [plane1, plane2] = this.drawPlane(x, y, z, d.value, i);
      const pointLabel = this.drawPointLabel(x, y, z, d.value, i);
      group.add(plane2);
      group.add(plane1);
      this.scene.add(pointLabel);
    });

    this.sixLineGroup = sixLineGroup;
    // this.pointLabelGroup = pointLabelGroup;
    this.scene.add(group);
    this.scene.add(sixLineGroup);
    // this.scene.add(pointLabelGroup);
  }
  textStyle = (text) => {
    const width = 512; const height = 256;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#C3C3C3';
    ctx.fillRect(0, 0, width, height);
    ctx.font = 50 + 'px  bold';
    ctx.fillStyle = '#2891FF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    return canvas;
  }

  /**
   * @desc 绘制飞线
   */
  drawFlyLine(data) {
    const group = new THREE.Group();
    data.forEach(d => {
      const slnglat = this.dataKeys[d.source.name];
      const tlnglat = this.dataKeys[d.target.name];
      const z = 10;
      const [x1, y1, z1] = this.lnglatToMector(slnglat);
      const [x2, y2, z2] = this.lnglatToMector(tlnglat);
      // 创建一条平滑的三维 二次贝塞尔曲线， 由起点、终点和一个控制点所定义
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3((x1 + x2) / 2, (y1 + y2) / 2, z),
        new THREE.Vector3(x2, y2, z2)
      );
      const points = curve.getPoints(this.pointsLength);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      var colors = [];
      var color = new THREE.Color();
      for (var j = 0; j < points.length; j++) {
        // color.setHSL(0.81666 + j, 0.88, 0.715 + j * 0.0025); // 粉色
        color.setStyle('#315990');
        colors.push(color.r, color.g, color.b);
      }
      geometry.vertices = points;
      // geometry.setAttribute.colors = new Array(points.length).fill(new THREE.Color('#ff0000'));
      geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3, true));
      const material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors,
        transparent: true,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Line(geometry, material);
      group.add(mesh);
    });
    this.flyGroup = group;
    this.scene.add(group);
  }
  /**
 * 绘制圆弧管道
 */
  setArcCurve() {
    console.log('xxxx');
    var geometry = new THREE.BufferGeometry();
    var arcCurve = new THREE.ArcCurve(0, 0, 60, 1, 2 * Math.PI);
    geometry.setFromPoints(arcCurve.getPoints(60));
    var material = new THREE.LineBasicMaterial({ color: 0xee00ff });
    var line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }
}
