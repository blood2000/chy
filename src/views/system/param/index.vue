<template>
  <div>
    <el-row>
      <el-col :lg="5" :md="6" :sm="7" :xs="24">
        <div class="app-container app-container--tree">
          <div class="el-tree-scroll-container page-param-tree">
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultTreeProps"
              :expand-on-click-node="false"
              default-expand-all
              :render-content="renderContent"
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </el-col>
      <el-col :lg="19" :md="18" :sm="17" :xs="24">
        <div v-for="item in formList" :key="item.id" class="app-container app-container--card">
          <h3 class="g-card-title g-card-header mb20">这是标题</h3>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import {  } from '@/api/system/param';

export default {
  name: 'Param',
  data() {
    return {
      // 树
      treeData: [{
        id: 1,
        label: '一级 1',
        type: 'class',
        children: [
          {
            id: 2,
            label: '二级 1'
          }, {
            id: 3,
            label: '二级 2'
          }, {
            id: 4,
            label: '二级 3'
          }
        ]
      }],
      defaultTreeProps: {
        children: 'children',
        label: 'label',
        // 父节点不可选中
        disabled: function(data, node) {
          if (data.type === 'class') {
            return !data.leaf;
          }
        }
      },
      // 表单
      formList: [
        { id: 1 },
        { id: 2 }
      ]
    };
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span class='custom-tree-button'>
            <el-button type='text' on-click={ () => this.appendTree(data) }><i class='el-icon-circle-plus-outline' /></el-button>
            <el-button type='text' on-click={ () => this.editTree(node, data) }><i class='el-icon-edit-outline' /></el-button>
            <el-button type='text' on-click={ () => this.removeTree(node, data) }><i class='el-icon-delete' /></el-button>
          </span>
        </span>);
    },
    appendTree(data) {
      const newChild = { label: 'testtest', children: [] };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },
    editTree(data) {
      console.log(data);
    },
    removeTree(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    handleNodeClick(data) {
      console.log(data);
    }
  }
};
</script>

<style lang="scss">
.page-param-tree{
  .el-tree-node__content .custom-tree-node{
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    .custom-tree-button{
      display: none;
    }
    &:hover{
      .custom-tree-button{
        display: block;
      }
    }
  }
}
</style>
