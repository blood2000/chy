<template>
  <pagination
    v-show="total>0"
    :total="total"
    :page.sync="dataModelDto.page.pageNum"
    :limit.sync="dataModelDto.page.pageSize"
    @pagination="$emit('getList')"
  />
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    dataModelDto: {
      type: Object,
      default: () => {
        return {
          queryFields: [],
          tableFields: [],
          page: {
            pageNum: 1,
            pageSize: 10
          }
        };
      }
    }
  }
};
</script>
