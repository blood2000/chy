<template>
  <div>
    <el-row>
      <el-checkbox-group v-model="checkGroup" size="medium" class="ml20">
        <el-col v-for="(item, index) in newList" :key="index" class="mb20" :span="8">
          <el-checkbox :label="item.cnName" style="width: 120px;" border :disabled="item.$_disabled" />
        </el-col>
      </el-checkbox-group>
    </el-row>

    <div class="ly-t-right">
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </div>

</template>

<script>

export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    selecedName: {
      type: Array,
      default: () => []
    },
    jianData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkGroup: [],
      newList: []
    };
  },
  created() {
    this.checkGroup = this.selecedName;

    this.newList = JSON.parse(JSON.stringify(this.list));

    this.jianData.forEach(e => {
      this.newList.forEach(ee => {
        if (e.cnName === ee.cnName) {
          ee.$_disabled = true;
        }
      });
    });
  },

  methods: {
    submitForm() {
      const arrr = this.checkGroup.map(e => {
        let bb = null;
        this.list.forEach(ee => {
          if (ee.cnName === e) {
            bb = ee;
            bb.ruleItemCode = ee.code;
          }
        });
        return bb;
      });

      this.$emit('submitForm', arrr);
    },
    cancel() {}
  }
};
</script>

<style>

</style>
