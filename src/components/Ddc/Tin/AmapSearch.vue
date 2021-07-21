<template>
  <div>
    <el-select
      v-model="keyValue"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      :clearable="clearable"
      :remote-method="remoteMethod"
      :loading="loading"
      :style="{ width: '100%' }"
      @change="handlechengDetail"
    >
      <el-option
        v-for="(dict,index) in detailOptin"
        :key="index + dict.dictValue"
        :label="dict.dictLabel"
        :value="dict.dictLabel"
      >
        <div class="option-item">
          <div class="option-item_name">{{ dict.dictLabel }}</div>
          <div class="option-item_address">{{ dict.address }}</div>
        </div>
      </el-option>
    </el-select>
    <el-amap-search-box
      v-show="false"
      :ref="`amap`"
      class="search-box"
      :search-option="searchOption"
      :on-search-result="onSearchResult"
    />
  </div>
</template>

<script>
/*
使用说明:
示例:
<AmapSearch v-model="formData.tin1" :searchOption="searchOption" @change="(data) => (selected = data)" />

Attributes:
v-model         可以回填直接填地址名,显示用   返回选中的id
searchOption    搜索条件

Events:
change          返回选中的具体信息
*/
export default {
  name: 'AmapSearch',
  props: {
    value: {
      type: String,
      default: ''
    },
    searchOption: {
      type: Object,
      default: () => {
        return {
          city: '全国',
          citylimit: true
        };
      }
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      keyValue: '',
      loading: false,
      detailOptin: []
    };
  },

  watch: {
    searchOption: {
      handler(value) {
        this.msearchOption = value;
      },
      deep: true
    },
    value: {
      handler(value) {
        this.keyValue = value;
      },
      deep: true
    }
  },

  created() {
    this.keyValue = this.value;
    this.msearchOption = this.searchOption;
  },

  methods: {
    // 1. 监听输入框
    remoteMethod(que) {
      if (que !== '') {
        this.loading = true;
        const vdom = this.$refs.amap;
        vdom.keyword = que;
        vdom.search();
      } else {
        this.detailOptin = [];
      }
    },
    onSearchResult(res) {
      this.detailOptin = this._baozhuan(res, 'id', 'name');
      this.loading = false;
    },
    // 2. 下拉选择地址
    handlechengDetail() {
      this.$emit('change', this._zhaovalue(this.detailOptin, this.keyValue));
      this.$emit('input', this.keyValue);
    },

    _zhaovalue(arr, value) {
      return arr.filter((e) => {
        return e.dictLabel === value;
      })[0];
    },

    // 包装成
    _baozhuan(arr, dictValue, dictLabel) {
      return arr.map((e) => {
        return {
          ...e,
          dictValue: e[dictValue],
          dictLabel: e[dictLabel]
        };
      });
    },

    // 重置
    clearOption() {
      this.detailOptin = [];
    }
  }
};
</script>

<style scoped>
.option-item {
  display: flex;
}
.option-item .option-item_name {
  margin-right: 10px;
}
.option-item .option-item_address {
  font-size: 12px;
  color: #ccc;
}
</style>
