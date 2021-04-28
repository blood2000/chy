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
        <template v-if="formList.length > 0">
          <div v-for="item in formList" :key="item.id" class="app-container app-container--card">
            <h3 class="g-card-title g-card-header mb20">
              {{ item.label }}
              <i class="el-icon-plus g-color-blue ml5" style="padding: 14px 5px; cursor: pointer" @click="addParam(item)" />
              <i class="el-icon-close g-color-gray fr" style="padding: 14px 5px; cursor: pointer" @click="closeCard(item)" />
            </h3>
            <div v-if="item.paramList.length > 0">
              <el-form label-width="140px" label-position="left">
                <el-form-item v-for="formItem in item.paramList" :key="formItem.code" :label="formItem.paramCnName" :prop="formItem.paramEnName">
                  <!-- input -->
                  <template v-if="formItem.paramFormType === '1'">
                    <el-input v-model="formItem.paramValue" disabled class="input-width" />
                  </template>
                  <!-- textarea -->
                  <template v-else-if="formItem.paramFormType === '3'">
                    <el-input v-model="formItem.paramValue" type="textarea" disabled class="input-width" />
                  </template>
                  <!-- select -->
                  <template v-else-if="formItem.paramFormType === '4'">
                    <el-select v-model="formItem.paramValue" disabled class="input-width">
                      <el-option
                        v-for="dict in formItem.paramDicts"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                  </template>
                  <!-- radio -->
                  <template v-else-if="formItem.paramFormType === '5'">
                    <el-radio-group v-model="formItem.paramValue" disabled class="input-width">
                      <el-radio
                        v-for="dict in formItem.paramDicts"
                        :key="dict.dictValue"
                        :label="dict.dictValue"
                      >{{ dict.dictLabel }}</el-radio>
                    </el-radio-group>
                  </template>
                  <!-- checkbox -->
                  <template v-else-if="formItem.paramFormType === '6'">
                    <el-checkbox v-model="formItem.paramValue" disabled label="是否勾选" class="input-width" />
                  </template>
                  <!-- switch -->
                  <template v-else-if="formItem.paramFormType === '7'">
                    <el-switch v-model="formItem.paramValue" disabled class="input-width" />
                  </template>
                  <!-- input -->
                  <template v-else>
                    <el-input v-model="formItem.paramValue" disabled class="input-width" />
                  </template>
                  <!-- button -->
                  <el-button type="text" class="ml10" @click="editParam(item, formItem)"><i class="el-icon-edit-outline" /></el-button>
                  <el-button type="text" class="ml10" @click="deleteParam(item, formItem)"><i class="el-icon-delete" /></el-button>
                </el-form-item>
              </el-form>
            </div>
            <div v-else class="none-card">
              <i class="el-icon-document-remove g-color-blue" />
              暂无数据
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-container">
            <div class="none-card">
              <i class="el-icon-document-remove g-color-blue" />
              暂无数据
            </div>
          </div>
        </template>
      </el-col>
    </el-row>

    <!-- 新增/编辑树 对话框 -->
    <setting-dialog ref="settingDialogRef" :open.sync="settingOpen" :title="title" @refresh="getTree" />
    <!-- 新增/编辑参数 对话框 -->
    <param-dialog ref="paramDialogRef" :open.sync="paramOpen" :title="title" @refresh="refreshParam" />
  </div>
</template>

<script>
import { getParamTree, delParamTree, getParam, delParam } from '@/api/system/param';
import SettingDialog from './settingDialog';
import ParamDialog from './paramDialog.vue';

export default {
  name: 'Param',
  components: {
    SettingDialog,
    ParamDialog
  },
  data() {
    return {
      settingOpen: false,
      paramOpen: false,
      title: '',
      // 树
      treeData: [],
      defaultTreeProps: {
        children: 'children',
        label: 'label'
      },
      // 表单
      formList: []
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span class='custom-tree-text'>{node.label}</span>
          <span class='custom-tree-button'>
            <el-button type='text' on-click={ (event) => this.appendTree(event, data) }><i class='el-icon-circle-plus-outline' /></el-button>
            <el-button type='text' on-click={ (event) => this.editTree(event, node, data) }><i class='el-icon-edit-outline' /></el-button>
            <el-button type='text' on-click={ (event) => this.removeTree(event, node, data) }><i class='el-icon-delete' /></el-button>
          </span>
        </span>);
    },
    getTree() {
      getParamTree().then(response => {
        this.treeData = response.data || [];
        if (this.treeData && this.treeData.length > 0 && this.treeData[0].children && this.treeData[0].children.length > 0) {
          this.handleNodeClick(this.treeData[0].children[0]);
        }
      });
    },
    appendTree(event, data) {
      this.$refs.settingDialogRef.reset();
      this.title = '新增';
      this.$refs.settingDialogRef.setAddForm(data);
      this.settingOpen = true;
      event.stopPropagation();
    },
    editTree(event, node, data) {
      this.$refs.settingDialogRef.reset();
      this.title = '编辑';
      this.$refs.settingDialogRef.setEditForm(data);
      this.settingOpen = true;
      event.stopPropagation();
    },
    removeTree(event, node, data) {
      this.$confirm('是否确认删除配置名称为"' + data.label + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delParamTree(data.code);
      }).then(() => {
        this.getTree();
        this.msgSuccess('删除成功');
        // 如果有打开卡片，也要删掉卡片
        this.closeCard(data);
      });
      event.stopPropagation();
    },
    handleNodeClick(data) {
      // 父节点不可选中
      if (data.id === 0) return;
      // 选中参数
      const flag = this.formList.some(el => {
        return el.id === data.id;
      });
      if (!flag) {
        getParam({ typeCode: data.code }).then(response => {
          data.paramList = [...(response.data || [])];
          this.formList.unshift(data);
        });
      }
    },
    closeCard(data) {
      this.formList = this.formList.filter(el => {
        return el.id !== data.id;
      });
    },
    addParam(data) {
      this.$refs.paramDialogRef.reset();
      this.title = '新增';
      this.$refs.paramDialogRef.setAddForm(data);
      this.paramOpen = true;
    },
    editParam(data, param) {
      this.$refs.paramDialogRef.reset();
      this.title = '编辑';
      this.$refs.paramDialogRef.setEditForm(data, param);
      this.paramOpen = true;
    },
    deleteParam(data, param) {
      this.$confirm('是否确认删除参数名称为"' + param.paramCnName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delParam(param.code);
      }).then(() => {
        this.refreshParam(data.code);
        this.msgSuccess('删除成功');
      });
    },
    refreshParam(typeCode) {
      getParam({ typeCode: typeCode }).then(response => {
        this.formList.forEach((el, index) => {
          if (el.code === typeCode) {
            this.formList[index].paramList = [...(response.data || [])];
            this.$forceUpdate();
          }
        });
      });
    }
  }
};
</script>

<style lang="scss">
// 表单样式
.input-width{
  width: 40%;
  min-width: 300px;
}
// 暂无数据样式
.none-card{
  height: 40px;
  line-height: 40px;
  text-align: center;
}
// 树样式
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
      >button{
        padding: 5px;
        +.el-button{
          margin-left: 0;
        }
      }
    }
    &:hover{
      .custom-tree-button{
        display: block;
      }
    }
  }
}
</style>
