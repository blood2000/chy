<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :inline="true" label-width="auto" @submit.native.prevent>
        <template v-for="(item, index) in dataModelDto.queryFields">
          <el-form-item v-if="!item.dynamic" :key="index" :label="item.dataItemInfo.itemCn">
            <!-- string -->
            <el-input
              v-if="item.dataItemInfo.itemType === 'string'"
              v-model="item.value"
              :placeholder="`请输入${item.dataItemInfo.itemCn}`"
              clearable
              style="width: 200px"
              size="small"
            />
            <!-- 整数类型|浮点类型 -->
            <template v-else-if="item.dataItemInfo.itemType === 'number' || item.dataItemInfo.itemType === 'float' || item.dataItemInfo.itemType === 'float4'">
              <el-input
                v-model="item.start"
                :placeholder="`请输入${item.dataItemInfo.itemCn}开始值`"
                clearable
                style="width: 200px"
                size="small"
              />
              至
              <el-input
                v-model="item.end"
                :placeholder="`请输入${item.dataItemInfo.itemCn}结束值`"
                clearable
                style="width: 200px"
                size="small"
              />
            </template>
            <!-- 时间类型 -->
            <template v-else-if="item.dataItemInfo.itemType === 'date'">
              <el-date-picker
                v-model="item.startTime"
                clearable
                size="small"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="开始时间"
                style="width: 200px"
              />
              至
              <el-date-picker
                v-model="item.endTime"
                clearable
                size="small"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="结束时间"
                style="width: 200px"
              />
            </template>
            <!-- 时间戳类型 -->
            <template v-else-if="item.dataItemInfo.itemType === 'timestamp'">
              <el-date-picker
                v-model="item.startTime"
                clearable
                size="small"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间"
                style="width: 200px"
                default-time="00:00:00"
              />
              至
              <el-date-picker
                v-model="item.endTime"
                clearable
                size="small"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束时间"
                style="width: 200px"
                default-time="23:59:59"
              />
            </template>
            <!-- 枚举类型 -->
            <el-select
              v-else-if="item.dataItemInfo.itemType === 'enum'"
              v-model="item.multiple"
              :placeholder="`请选择${item.dataItemInfo.itemCn}`"
              clearable
              multiple
              style="width: 200px"
              size="small"
            >
              <el-option
                v-for="dict in item.itemOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
            <!-- 自定义枚举类型 -->
            <el-select
              v-else-if="item.dataItemInfo.itemType === 'custom'"
              v-model="item.multiple"
              :placeholder="`请选择${item.dataItemInfo.itemCn}`"
              clearable
              multiple
              style="width: 200px"
              size="small"
            >
              <el-option
                v-for="dict in item.itemOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
            <!-- 输入框 -->
            <el-input
              v-else
              v-model="item.value"
              :placeholder="`请输入${item.dataItemInfo.itemCn}`"
              clearable
              style="width: 200px"
              size="small"
            />
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="chartAlias && chartAlias !== 'table'" class="app-container">
      <div v-if="dataList.length > 0" ref="chartBoxRef" style="width: 600px; height: 360px" />
      <DataNull v-else style="margin: 50px 0" />
    </div>

    <div v-else class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-download"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

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
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { getDataModel, searchDataModel, getCustomEnumById } from '@/api/dataCenter/dataCenter.js';
import { getChartSetting } from '@/api/dataCenter/chartSetting.js';
import { deepClone } from '@/utils/index';
import DataNull from '@/components/DataNull/index';
import chartViewMixins from '../mixins/chartViewMixins';
export default {
  name: '',
  components: {
    DataNull
  },
  mixins: [chartViewMixins],
  data() {
    return {
      modelId: null,
      // 显示搜索条件
      showSearch: true,
      queryFields: [],
      tableFields: [],
      // 总条数
      total: 0,
      loading: false,
      // 导出按钮
      exportLoading: false,
      // 列表数据
      dataList: [],
      dataModelDto: {
        queryFields: [],
        tableFields: [],
        page: {
          pageNum: 1,
          pageSize: 10
        }
      },
      // 图表类型
      chartAlias: '',
      chartId: null,
      chartConfigValueJson: null,
      // 配置树
      chartSetting: [],
      // 扁平化配置树
      chartSettingArr: []
    };
  },
  mounted() {
    const path = this.$route.path;
    const pathArr = path.split('/');
    this.modelId = pathArr[pathArr.length - 1];
    this.getDataModelData();
  },
  methods: {
    /** 获取模型数据 */
    getDataModelData() {
      getDataModel(this.modelId).then(async res => {
        if (res.data && res.data.dataModelDto) {
          this.chartAlias = res.data.chartAlias;
          const dataModelDto = res.data.dataModelDto;
          // 图表
          if (this.chartAlias !== 'table') {
            this.chartId = res.data.chartId;
            this.chartConfigValueJson = res.data.dataModelDto.chartConfigValueJson;
          }
          // 如果是枚举类型，要请求字典
          if (dataModelDto.queryFields) {
            for (let i = 0; i < dataModelDto.queryFields.length; i++) {
              const el = dataModelDto.queryFields[i];
              if (el.dataItemInfo.itemKey && el.dataItemInfo.itemKey !== '') {
                if (el.dataItemInfo.itemType === 'enum') {
                  await this.getDicts(el.dataItemInfo.itemKey).then(value => {
                    dataModelDto.queryFields[i].itemOptions = value.data;
                  });
                }
                if (el.dataItemInfo.itemType === 'custom') {
                  await getCustomEnumById(el.dataItemInfo.id).then(value => {
                    dataModelDto.queryFields[i].itemOptions = value.data;
                  });
                }
              }
            }
          }
          // 缓存数据
          this.$nextTick(() => {
            const { queryFields, tableFields } = dataModelDto;
            this.queryFields = queryFields || [];
            this.tableFields = tableFields || [];
            this.dataModelDto = deepClone(dataModelDto);
            this.resetQuery();
          });
        }
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.dataModelDto.page.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dataModelDto.queryFields = deepClone(this.queryFields);
      this.dataModelDto.tableFields = deepClone(this.tableFields);
      this.resetForm('queryForm');
      this.handleQuery();
    },
    getList() {
      this.loading = true;
      searchDataModel(Object.assign({}, this.dataModelDto, { dataModelId: this.modelId })).then(res => {
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
    /** 导出 */
    async handleExport() {
      this.exportLoading = true;
      await this.download('/analysis/dataModelInfos/export', Object.assign({}, this.dataModelDto, { dataModelId: this.modelId }), '导出文件', 'application/json');
      this.exportLoading = false;
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
        setTimeout(() => {
          this.handleGenerate();
        }, 0);
      });
    },
    // 获取扁平化的配置树
    getChartSettingArr(isFirst) {
      this.chartSettingArr = [];
      this.handleDeepSettingTree(this.chartSetting, null, isFirst);
    },
    // 刷新图表
    handleGenerate() {
      this.getJson(this.dataList);
      this.initChart();
    }

  }
};
</script>
