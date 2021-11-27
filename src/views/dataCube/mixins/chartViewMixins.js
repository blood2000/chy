import * as echarts from 'echarts';
export default {
  data() {
    return {
      chart: null,
      // 生成的图表json
      chartJson: {}
    };
  },
  methods: {
    /**
     * 递归遍历树
     * @param { Arrary } arr chartSetting配置数组
     * @param { String } path 全路径
     * @param { Boolean } isFirst 判断是否是第一次加载数据
     */
    handleDeepSettingTree(arr, path, isFirst) {
      arr.forEach(el => {
        // 设置data的configType默认值
        if (el.data.type === 3 && (!el.data.configType || el.data.configType === '')) {
          el.data.configType = 'dataValue';
        }
        // 第一次加载数据时，获取字典
        if (isFirst && el.data.configType === 'enum') {
          this.getDicts(el.data.configKey).then(result => {
            el.itemOptions = result.data;
          });
        }
        // 扁平化数组
        el.all_path = (path ? path + '.' : '') + el.data.configEn;
        if (el.all_path.split('.').length === 2 && el.all_path.split('.')[0] === 'series') {
          // 防止series内的key值重复
          el.all_path = (path ? path + '.' : '') + el.data.configEn + (',' + el.id);
        }
        this.chartSettingArr.push(el);
        // 递归
        if (el.children && el.children.length > 0) {
          this.handleDeepSettingTree(el.children, el.all_path, isFirst);
        }
      });
    },
    /**
     * 构造json
     * @param { Array } dataList 查询结果数据
     */
    getJson(dataList) {
      this.chartJson = {};
      this.getChartSettingArr();
      this.chartSettingArr.forEach(el => {
        const type = el.data.type;
        let item;
        if (type === 0) {
          // 对象
          item = this.getLevelByPath(el.all_path, {});
        } else if (type === 1) {
          // 数组
          item = this.getLevelByPath(el.all_path, {});
        } else if (type === 2) {
          // 项
          item = this.getLevelByPath(el.all_path, el.data.value);
        } else if (type === 3) {
          // 数据
          if (el.data.configType === 'dataValue' && el.data.value && el.data.value !== '') {
            // 数据源是数据集
            item = this.getLevelByPath(el.all_path, dataList.map(
              val => {
                return val[el.data.value];
              })
            );
          } else if (el.data.configType === 'dataCustom') {
            // 数据源是自定义
            item = this.getLevelByPath(el.all_path, el.data.value);
          } else {
            item = this.getLevelByPath(el.all_path, []);
          }
        }
        this.assiginObj(this.chartJson, item);
      });
      // 重构series格式
      const series = [];
      for (const key in this.chartJson) {
        if (key === 'series') {
          for (const i in this.chartJson[key]) {
            const item = this.chartJson[key][i];
            // 防止series内的key值重复
            item.type = i.split(',')[0];
            series.push(item);
          }
        }
      }
      if (this.chartJson['series']) this.chartJson['series'] = series;
      console.log('配置树：', this.chartSetting);
      console.log('扁平化数组：', this.chartSettingArr);
    },
    /**
     * 将a.b.c转化为{a:{b:{c:xx}}}
     * @param {*} all_path a.b.c
     * @param {*} value xx
     * @returns '{a:{b:{c:xx}}}'
     */
    getLevelByPath(all_path, value) {
      const pathArr = all_path.split('.');
      var lastItem = value;
      for (var i = pathArr.length - 1; i >= 0; i--) {
        var item = {};
        item[pathArr[i]] = lastItem;
        lastItem = item;
      }
      return lastItem;
    },
    /**
     * 多层级对象合并
     * @param {*} target 目标对象
     * @param {*} sources 源对象
     * @returns
     */
    assiginObj(target = {}, sources = {}) {
      const obj = target;
      if (typeof target !== 'object' || typeof sources !== 'object') {
        return sources;
      }
      for (const key in sources) {
        if (Object.hasOwnProperty.call(target, key)) {
          obj[key] = this.assiginObj(target[key], sources[key]);
        } else {
          obj[key] = sources[key];
        }
      }
      return obj;
    },
    /**
     * 渲染图表
     */
    initChart() {
      if (this.chart) this.chart.clear();
      this.chart = echarts.init(this.$refs.chartBoxRef, 'macarons');
      this.chart.setOption(this.chartJson);
    },
    /**
     * 编辑回填值
     */
    fillBackConfigValue() {
      const chartConfigValueJson = JSON.parse(this.chartConfigValueJson);
      // 构造map, 保存各个图表类型的数量和id数组
      const itemMap = {};
      chartConfigValueJson.forEach(el => {
        if (el.all_path.split('.').length === 2 && el.all_path.split('.')[0] === 'series') {
          const type = el.all_path.split('.')[1].split(',')[0];
          if (itemMap[type]) {
            itemMap[type].num++;
            itemMap[type].arr.push(el);
          } else {
            itemMap[type] = {};
            itemMap[type].num = 1;
            itemMap[type].arr = [];
            itemMap[type].arr.push(el);
          }
        }
      });
      console.log('itemMap: ', itemMap);
      // series多项的时候, 配置只有一项, 要自己根据值去生成
      const newSeriesArr = [];
      let seriesIndex;
      this.chartSetting.forEach((result, index) => {
        if (result.label === 'series' && result.children) {
          seriesIndex = index;
          result.children.forEach(el => {
            const type = el.all_path.split('.')[1].split(',')[0];
            const num = itemMap[type].num - 1;
            const arr = itemMap[type].arr.slice(1);
            for (let i = 0; i < num; i++) {
              newSeriesArr.push(arr[i]);
            }
          });
        }
      });
      console.log(newSeriesArr);
      console.log(seriesIndex);
      if (seriesIndex !== null && seriesIndex !== undefined) {
        this.chartSetting[seriesIndex].children = [...this.chartSetting[seriesIndex].children, ...newSeriesArr];
      }
      // 构造map
      const valueObj = {};
      console.log(chartConfigValueJson);
      chartConfigValueJson.forEach(el => {
        valueObj[el.all_path] = {
          value: el.data.value,
          configType: el.data.configType
        };
      });
      console.log('valueObj: ', valueObj);
      console.log(this.chartSetting);
      // 递归遍历配置树,回填值
      this.handleDeepSetting(this.chartSetting, valueObj);
      console.log(this.chartSetting);
    },
    /**
     * 递归遍历树
     * @param {*} arr
     * @param {*} valueObj
     */
    handleDeepSetting(arr, valueObj) {
      arr.forEach(el => {
        // 回填值
        if (el.all_path && valueObj) el.data.value = valueObj[el.all_path].value;
        // 回填data类型
        if (el.all_path && valueObj && valueObj[el.all_path]) el.data.configType = valueObj[el.all_path].configType;
        // 递归
        if (el.children && el.children.length > 0) {
          this.handleDeepSetting(el.children, valueObj);
        }
      });
    }
  }
};
