import * as d3 from 'd3-geo';
import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

// 初始化一个场景
export default class ThreeMap {
  constructor(set) {
    this.mapData = set.mapData;
    this.color = '#24335e';
    this.width = 0;
    this.height = 0;
    this.init();
  }

  /**
   * @desc 初始化场景
   */
  init() {
    const $el = document.getElementById('map_box');
    this.width = $el.clientWidth;
    this.height = $el.clientHeight;
    this.scene = new THREE.Scene();
    console.log('width', this.width);
    console.log('height', this.height);
    this.camera = new THREE.PerspectiveCamera(10, this.width / this.height, 1, 1000);

    this.setCamera({ x: 220, y: 0, z: 220 });
    this.setLight();
    this.setRender();

    this.setHelper();

    this.drawMap();

    this.setControl();
    this.animate();

    document.body.addEventListener('click', this.mouseEvent.bind(this));
  }

  /**
   * @desc 鼠标事件处理
   */
  mouseEvent(event) {
    if (!this.raycaster) {
      this.raycaster = new THREE.Raycaster();
    }
    if (!this.mouse) {
      this.mouse = new THREE.Vector2();
    }
    if (!this.meshes) {
      this.meshes = [];
      this.group.children.forEach(g => {
        g.children.forEach(mesh => {
          this.meshes.push(mesh);
        });
      });
    }

    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    this.mouse.x = (event.clientX / this.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.height) * 2 + 1;

    // 通过摄像机和鼠标位置更新射线
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 计算物体和射线的焦点
    const intersects = this.raycaster.intersectObjects(this.meshes);
    if (intersects.length > 0) {
      this.clickFunction(event, intersects[0].object.parent);
    }
  }

  /**
   * @desc 设置区域颜色
   */
  setAreaColor(g, color = '#ff0') {
    // 恢复颜色
    g.parent.children.forEach(gs => {
      gs.children.forEach(mesh => {
        mesh.material.color.set(this.color);
      });
    });

    // 设置颜色
    g.children.forEach(mesh => {
      mesh.material.color.set(color);
    });
  }

  /**
   * @desc 绑定事件
   */
  on(eventName, func) {
    if (eventName === 'click') {
      this.clickFunction = func;
    }
  }

  /**
   * @desc 绘制地图
   */
  drawMap() {
    console.log(this.mapData);
    if (!this.mapData) {
      console.error('this.mapData 数据不能是null');
      return;
    }
    // 把经纬度转换成x,y,z 坐标
    console.log('mapData', this.mapData);
    this.mapData.features.forEach(d => {
      d.vector3 = [];
      d.geometry.coordinates.forEach((coordinates, i) => {
        d.vector3[i] = [];
        coordinates.forEach((c, j) => {
          if (c[0] instanceof Array) {
            d.vector3[i][j] = [];
            c.forEach(cinner => {
              const cp = this.lnglatToMector(cinner);
              d.vector3[i][j].push(cp);
            });
          } else {
            const cp = this.lnglatToMector(c);
            d.vector3[i].push(cp);
          }
        });
      });
    });

    console.log(this.mapData);

    // 绘制地图模型
    const group = new THREE.Group();
    const lineGroup = new THREE.Group();
    this.mapData.features.forEach(d => {
      const g = new THREE.Group(); // 用于存放每个地图模块。||省份
      g.data = d;
      d.vector3.forEach(points => {
        // 多个面
        if (points[0][0] instanceof Array) {
          points.forEach(p => {
            const mesh = this.drawModel(p);
            const lineMesh = this.drawLine(p);
            lineGroup.add(lineMesh);
            g.add(mesh);
          });
        } else {
          // 单个面
          const mesh = this.drawModel(points);
          const lineMesh = this.drawLine(points);
          lineGroup.add(lineMesh);
          g.add(mesh);
        }
      });
      group.add(g);
    });
    this.group = group; // 丢到全局去
    const lineGroupBottom = lineGroup.clone();
    lineGroupBottom.position.z = -2;
    this.scene.add(lineGroup);
    this.scene.add(lineGroupBottom);
    this.scene.add(group);
  }

  /**
   * @desc 绘制线条
   * @param {} points
   */
  drawLine(points) {
    var geometry = new LineGeometry();
    const pointArr = [];
    points.forEach(d => {
      const [x, y, z] = d;
      pointArr.push(x, y, z);
    });
    geometry.setPositions(pointArr);
    var material = new LineMaterial({
      color: 0x275fa4,
      linewidth: 3
    });
    material.resolution.set(window.innerWidth, window.innerHeight); // 设置材质分辨率
    var line = new Line2(geometry, material); // 创建 Line2
    line.computeLineDistances(); // 设置下线条长度
    return line;
    /*     const material = new THREE.LineBasicMaterial({
      color: '#275fa4',
      linewidth: 3
    });
    const geometry = new THREE.BufferGeometry();
    const pointsArr = [];
    points.forEach(d => {
      const [x, y, z] = d;
      pointsArr.push(x, y, z);
    });
    var vertices = new Float32Array(pointsArr);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const line = new THREE.Line(geometry, material);
    return line; */
  }

  /**
   * @desc 绘制地图模型 points 是一个二维数组 [[x,y], [x,y], [x,y]]
   */
  drawModel(points) {
    const shape = new THREE.Shape();
    points.forEach((d, i) => {
      const [x, y] = d;
      if (i === 0) {
        shape.moveTo(x, y);
      } else if (i === points.length - 1) {
        shape.quadraticCurveTo(x, y, x, y); // 二次曲线
      } else {
        shape.lineTo(x, y, x, y);
      }
    });

    const geometry = new THREE.ExtrudeGeometry(shape, {
      amount: -2,
      bevelEnabled: false
    });
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  /**
   * @desc 经纬度转换成墨卡托投影
   * @param {array} 传入经纬度
   * @return array [x,y,z]
   */
  lnglatToMector(lnglat) {
    if (!this.projection) {
      this.projection = d3
        .geoMercator()
        .center([108.904496, 36.668849])
        .scale(80) // 设置投影的比例尺为特定的值，并返回投影
        .rotate(Math.PI / 4) // 如果rotation 旋转指定了，设置投影的三轴旋转为指定的角度λ，φ和γ（偏航角，倾斜角和滚动角，或等效地经度，纬度和滚动），以度并返回投影。如果rotation 未指定，返回当前缺省的转动值[0, 0, 0]。如果rotation 指定且只有两个值，而不是3个值，那么滚动的角度被假设为0°。
        .translate([0, 0]); // 如果point 点指定了，则设置投影转变的位移为指定的二元数组[x, y]并返回的投影。如果未指定点，则返回当前变换的位移，默认为[480, 250]。变换的位移确定投影的中心像素坐标。默认转换位移的位置是⟨0°,0°⟩，在一个960×500区域的中心。
    }
    const [y, x] = this.projection([...lnglat]);
    const z = 0;
    return [x, y, z];
  }

  /**
   * @desc 动画
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // required if controls.enableDamping or controls.autoRotate are set to true
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);

    this.doAnimate && this.doAnimate.bind(this)();
  }

  /**
   * @desc 设置控制器
   */
  setControl() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
  }

  /**
   * @desc 相机
   */
  setCamera(set) {
    const { x, y, z } = set;
    this.camera.up.x = 0;
    this.camera.up.y = 0;
    this.camera.up.z = 1;
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
  }

  /**
   * @desc 设置光线
   */
  setLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // 方向光（DirectionalLight也称无限光，从这种光源发出的光线可以看作是平行的，例如太阳光）
    this.scene.add(directionalLight);
  }

  /**
   * @desc 设置渲染器
   */
  setRender() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    this.renderer.setClearAlpha(0);
    this.renderer.setSize(this.width, this.height);
    // document.body.appendChild(this.renderer.domElement);
    document.getElementById('map_box').appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer(); // 新增的渲染器
    this.labelRenderer.setSize(this.width, this.height);
    // this.labelRenderer.domElement.style.position = 'absolute';
    // this.labelRenderer.domElement.style.top = 0;
    this.labelRenderer.domElement.style = 'pointer-events: auto;position: absolute;top: 0px;'; // 处理新的渲染器
    document.getElementById('map_box').appendChild(this.labelRenderer.domElement);
  }

  /**
   * @desc 设置参考线
   */
  setHelper() {
    const axesHelper = new THREE.AxisHelper(5);
    this.scene.add(axesHelper);
  }

  /**
   * 绘制圆弧管道
   */
  setArcCurve() {
    var geometry = new THREE.Geometry();
    var arcCurve = new THREE.ArcCurve(0, 0, 100, 0, 2 * Math.PI);
    geometry.setFromPoints(arcCurve.getPoints(50));
    var material = new THREE.LineBasicMaterial({ color: 0xee00ff });
    var line = new THREE.Line(geometry, material);
    return line;
  }
}
