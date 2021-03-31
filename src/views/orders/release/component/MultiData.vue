<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      />
    </el-tabs>

    <div v-for="item in tabs" v-show="activeName === item.value" :key="item.value">
      <AccounTing :ref="'accounTing'+item.value" :pubilsh-code="pubilshCode" />
    </div>

    <el-button @click="_submitForm">测试获取</el-button>
  </div>
</template>

<script>
import AccounTing from './AccounTing';
export default {
  name: 'MultiData',
  components: { AccounTing },
  props: {
    formConfig: {
      type: Object,
      default: () => {
        return {
          size: 'medium',
          labelWidth: '110px',
          labelPosition: 'left'
        };
      }
    },
    pubilshCode: {
      type: String,
      default: ''
    },

    address: {
      type: Array,
      default: () => []
    },
    // true = 装货, false = 卸货
    nowType: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      orderFreightBoList: null,
      activeName: '0',
      tabs: []

    };
  },
  computed: {
    isNamw() {
      return this.nowType ? 'add' : 'xie';
    }
  },

  watch: {
    address: {
      handler(value) {
        this.tabs = value.map((e, index) => {
          return {
            refName: e.refName,
            label: e.refName.includes('xie') ? '卸载地址' + (index + 1) : '装货地址' + (index + 1),
            value: index + ''
          };
        });
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    _submitForm() {
      return this.tabs.map(async e => {
        return {
          [this.isNamw + '_' + e.value]: await this.$refs['accounTing' + e.value][0]._submitForm()
        };
      });
    }
  }
};
</script>

