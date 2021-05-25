<template>
  <el-dialog :title="`数据IC卡: ${ titleData.ttttt1111 || 'IC20511547'} (承运司机: ${titleData.ttttt222 ||'张张张'})`" :visible="visible" width="80%" append-to-body @close="$emit('update:open', false)">

    <!-- 表格 -->
    <RefactorTable
      :loading="loading"
      :data="list"
      :table-columns-config="[
        {
          prop: 'id',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '承运车辆'
        },
        {
          prop: 'id1',
          isShow: true,
          label: '项目(装货地)'
        },
        {
          prop: 'id2',
          isShow: true,
          label: '卸货地'
        },
        {
          prop: 'id3',
          isShow: true,
          label: '装货时间'
        },
        {
          prop: 'id4',
          isShow: true,
          label: '操作员'
        },
        {
          prop: 'id5',
          isShow: true,
          label: '运单编号'
        },
        {
          prop: 'id6',
          isShow: true,
          label: '核对状态'
        },
        {
          prop: 'id7',
          width: 100,
          isShow: true,
          label: '核对时间'
        }
      ]"
    >
      <template #id6="{row}">
        <span v-if="row.id6 === 0">√</span>
        <el-button v-else type="danger" plain @click="absenceOpen(row)">不存在</el-button>
      </template>
    </RefactorTable>


    <div slot="footer" class="dialog-footer ly-flex-pack-center">
      <el-button type="primary" @click="submitForm">保存并清空</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'NuclearCard',
  components: {
    // UploadImage
  },
  props: {
    open: Boolean
  },
  data() {
    return {
      titleData: {},
      loading: false,

      list: [{
        id: 1,
        id6: 1,
        id7: '2021.06.21 15:30:45'
      }]
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  created() {
  },

  methods: {
    init(data) {
      console.log(data);



      // 请求失败提示
    //   this._reqerror();
    },

    absenceOpen(row) {
      this.$confirm('运单不存在', `运单: ${'YGH123456789'}`, {
        confirmButtonText: '转为正常单',
        cancelButtonText: '删除该条记录',
        type: 'warning',
        center: true
      }).then(() => {
        console.log('转为正常单');
      }).catch(() => {
        console.log('删除该条记录');
      });
    },

    submitForm() {
      console.log('保存并清空');
    },

    _reqerror() {
      this.$confirm('请将【数据IC卡】放至有效位置!', '为能读取到数据', {
        confirmButtonText: '知道了',
        type: 'warning',
        showCancelButton: false,
        center: true
      }).then(() => {
        this.$emit('update:open', false);
      }).catch(() => {
        this.$emit('update:open', false);
      });
    }
  }
};
</script>

<style>

</style>
