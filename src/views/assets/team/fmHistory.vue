<!-- FM历史 -->
<template>
  <div class="app-container">
    <RefactorTable
      :loading="loading"
      :data="fmList"
      :table-columns-config="tableColumnsConfig"
    >
    </RefactorTable>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "FmHistory",
  props: {
    teamCode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: "/transportation/orderInfoSearch/pageFmOrder",
      // 遮罩层
      loading: true,
      pageNum: 1,
      pageSize: 10,
      height: undefined,
      fmList: null,
      total: 0,
    };
  },

  components: {},

  computed: {},

  watch: {
    teamCode(val) {
      // console.log(val)
      this.pageNum = 1;
      this.getList();
    },
  },

  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, this.api);
    this.getList();
  },

  methods: {
    getList() {
      this.loading = true;
      this.fmRequest().then((res) => {
        console.log("FM历史数据", res);
        this.fmList = res.data.list;
        this.loading = false;
        this.height = 485;
        this.total = res.data.total;
      });
    },
    fmRequest() {
      return request({
        url: this.api,
        method: "get",
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          teamCode: this.teamCode,
        },
      });
    },
  },
};
</script>
<style lang='scss' scoped>
</style>