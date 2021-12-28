<template>
  <div
    class="layer-box"
    :style="isGeneral ? numberToPx(layerData.style) : removePosition(numberToPx(layerData.style))"
    :class="layerData.type === 'img' ? 'fontSize0' : ''"
  >
    <!-- 模型图层 -->
    <div v-if="layerData.id" ref="chartBoxRef" class="content-box">
      <!-- 图表 -->
      <template v-if="chartAlias && chartAlias !== 'table'">
        <DataNull />
      </template>

      <!-- 列表 -->
      <template v-else>
        <el-table v-loading="loading" highlight-current-row border :data="dataList">
          <el-table-column type="index" label="序号" fixed="left" align="center" width="50" />
          <el-table-column
            v-for="(item, index) in dataModelDto.tableFields"
            :key="item.dataItemInfo.itemEn + index"
            :prop="item.functionType ? item.functionFieldAlias : `${item.nodeId}_${item.dataItemInfo.itemEn}`"
            align="center"
            :label="item.fieldLabel"
          />
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="dataModelDto.page.pageNum"
          :limit.sync="dataModelDto.page.pageSize"
          @pagination="getTableList"
        />
      </template>
    </div>

    <!-- 元素图层 -->
    <template v-else>
      <!-- 文本 -->
      <template v-if="layerData.type === 'text'">{{ layerData.value }}</template>
      <!-- 图片 -->
      <img v-else-if="layerData.type === 'img'" :src="layerData.value?`/pdf${(layerData.value.split('.com'))[1]}`:layerData.value" class="content-box" draggable="false">
    </template>
  </div>
</template>

<script>
import utils from '../../mixins/utils';
import chartViewMixins from '../../mixins/chartViewMixins';
import DataNull from '@/components/DataNull/index';
import { getDataModel, searchDataModel } from '@/api/dataCenter/dataCenter.js';
import { getChartSetting } from '@/api/dataCenter/chartSetting.js';
export default {
  components: {
    DataNull
  },
  mixins: [utils, chartViewMixins],
  props: {
    layerData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isGeneral: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // table
      loading: false,
      total: 0,
      dataList: [],
      // 模型查询参数
      dataModelDto: {
        queryFields: [],
        tableFields: [],
        page: {
          pageNum: 1,
          pageSize: 10
        }
      },
      // 图表类型
      chartAlias: null,
      chartId: null,
      chartConfigValueJson: null,
      // 配置树
      chartSetting: [],
      // 扁平化配置树
      chartSettingArr: []
    };
  },
  watch: {
    // chart 监听容器宽
    'layerData.style.width': {
      handler(val) {
        if (this.layerData.id && this.chartAlias && this.chartAlias !== 'table') {
          this.handleGenerate();
        }
      },
      deep: true
    },
    // chart 监听容器高
    'layerData.style.height': {
      handler(val) {
        if (this.layerData.id && this.chartAlias && this.chartAlias !== 'table') {
          this.handleGenerate();
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.layerData.id) {
      this.getModelData();
    }
  },
  methods: {
    /** 获取模型数据 */
    getModelData() {
      getDataModel(this.layerData.id).then(async res => {
        if (res.data && res.data.dataModelDto) {
          this.chartAlias = res.data.chartAlias;
          this.dataModelDto = res.data.dataModelDto;
          if (this.chartAlias && this.chartAlias !== 'table') {
            // 图表
            this.chartId = res.data.chartId;
            this.chartConfigValueJson = this.dataModelDto.chartConfigValueJson;
          }
          this.getTableList();
        }
      });
    },
    /** 获取列表 */
    getTableList() {
      this.loading = true;
      searchDataModel(Object.assign({}, this.dataModelDto, { dataModelId: this.layerData.id })).then(res => {
        this.loading = false;
        if (res.data) {
          const { list, total } = res.data;
          this.total = total || 0;
          this.dataList = list || [];
        } else {
          this.total = 0;
          this.dataList = [];
        }
        // 图表
        if (this.chartAlias && this.chartAlias !== 'table' && this.dataList.length > 0) {
          this.getChartSetting();
        }
      });
    },
    // 读取图表配置树
    getChartSetting() {
      getChartSetting(this.chartId).then(res => {
        if (res.data && res.data.length > 0) {
          this.chartSetting = res.data[0].children;
        } else {
          this.chartSetting = [];
        }
        // 编辑回填值
        if (this.chartConfigValueJson) {
          this.$nextTick(() => {
            this.fillBackConfigValue();
          });
        }
        // 扁平化数组
        this.getChartSettingArr(true);
        // 渲染图表
        this.handleGenerate();
      });
    },
    // 获取扁平化的配置树
    getChartSettingArr(isFirst) {
      this.chartSettingArr = [];
      this.handleDeepSettingTree(this.chartSetting, null, isFirst);
    },
    // 刷新图表
    handleGenerate() {
      setTimeout(() => {
        this.getJson(this.dataList);
        this.initChart();
      }, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
.layer-box{
  overflow: auto;
  &.fontSize0{
    font-size: 0;
  }
  .content-box{
    width: 100%;
    height: 100%;
  }
}
</style>
