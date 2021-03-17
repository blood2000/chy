<template>
  <div>
    <el-tag
      v-for="city in citys"
      ref="CityTag"
      :key="city.cityName"
      closable
      class="mr8"
      @close="tagClose(city.cityCode)"
    >
      {{ city.cityName }}
    </el-tag>
    <el-select
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      filterable
      remote
      reserve-keyword
      placeholder="请输入城市名"
      size="mini"
      style="width: 120px"
      :remote-method="remoteMethod"
      :loading="loading"
      @change="handleInputConfirm"
      @blur="handleBlur"
    >
      <el-option
        v-for="item in options"
        :key="item.cityCode"
        :label="item.cityName"
        :value="item.cityCode"
      />
    </el-select>
    <el-button v-else icon="el-icon-plus" round size="mini" @click="showInput()">添加城市</el-button>
  </div>
</template>

<script>
/*
  使用示例: <add-city-tag :prop-citys="form.citys" @refresh="(val) => form.citys=val" />
*/
import { getCityList } from '@/api/system/area';
export default {
  props: {
    propCitys: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      loading: false,
      options: [],
      citys: this.propCitys
    };
  },
  methods: {
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus();
      });
    },
    handleBlur() {
      setTimeout(() => {
        this.inputVisible = false;
      }, 200);
    },
    // 远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        getCityList({ cityName: query }).then(response => {
          this.loading = false;
          this.options = response.rows;
        });
      } else {
        this.options = [];
      }
    },
    // 添加城市
    handleInputConfirm(code) {
      const choosed = this.options.filter(el => {
        return el.cityCode === code;
      });
      if (choosed.length > 0 && !this.iSRepeat(code)) {
        this.citys.push(choosed[0]);
      }
      this.inputVisible = false;
      this.inputValue = '';
      this.refresh();
    },
    // 判断是否重复城市
    iSRepeat(code) {
      const isSome = this.citys.some((el) => {
        return el.cityCode === code;
      });
      return isSome;
    },
    // 删除标签
    tagClose(tag) {
      this.citys = this.citys.filter((el) => {
        return el.cityCode !== tag;
      });
      this.refresh();
    },
    // 更新父组件数据
    refresh() {
      this.$emit('refresh', this.citys);
    }
  }
};
</script>

<style scoped>
.mr8{
  margin-right: 8px;
}
</style>
