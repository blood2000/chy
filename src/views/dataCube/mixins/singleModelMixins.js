import { getDataModel, searchDataModel, getCustomEnumById } from '@/api/dataCenter/dataCenter.js';
import { getChartSetting } from '@/api/dataCenter/chartSetting.js';
import { deepClone } from '@/utils/index';
export default {
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
      isJumpTo: 0,
      dataModelJumpToVo: {
        jumpToModelId: null,
        modelId: null,
        jumpToOperateParams: []
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
  methods: {
    /** 获取模型数据 */
    getDataModelData() {
      getDataModel(this.modelId).then(async res => {
        if (res.data && res.data.dataModelDto) {
          this.chartAlias = res.data.chartAlias;
          this.isJumpTo = res.data.isJumpTo;
          if (res.data.dataModelJumpToVo) {
            this.dataModelJumpToVo = res.data.dataModelJumpToVo;
          }
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
            // 如果是模型跳模型，则接收参数作为查询条件
            this.getQueryParams();
            this.dataModelDto = deepClone(dataModelDto);
            this.resetQuery();
          });
        }
      });
    },
    getQueryParams() {
      const query = this.$route.query;
      console.log('query: ', query);
      if (!query || JSON.stringify(query) === '{}') return;
      this.queryFields = this.queryFields.map(el => {
        if (!query[el.dataItemInfo.itemEn]) {
          return el;
        } else {
          if (el.dataItemInfo.itemType === 'string') {
            el.value = query[el.dataItemInfo.itemEn];
          } else if (el.dataItemInfo.itemType === 'number' || el.dataItemInfo.itemType === 'float' || el.dataItemInfo.itemType === 'float4' || el.dataItemInfo.itemType === 'money') {
            el.start = query[el.dataItemInfo.itemEn];
            el.end = query[el.dataItemInfo.itemEn];
          } else if (el.dataItemInfo.itemType === 'date' || el.dataItemInfo.itemType === 'timestamp') {
            el.startTime = query[el.dataItemInfo.itemEn];
            el.endTime = query[el.dataItemInfo.itemEn];
          } else if (el.dataItemInfo.itemType === 'enum' || el.dataItemInfo.itemType === 'custom') {
            el.multiple = query[el.dataItemInfo.itemEn];
          } else {
            el.value = query[el.dataItemInfo.itemEn];
          }
          return el;
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
