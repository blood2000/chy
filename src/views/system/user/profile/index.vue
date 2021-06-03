<template>
  <div class="profile-index ly-flex ly-flex-pack-justify">
    <div class="left-panel app-container">
      <div class="text-center">
        <userAvatar :user="user" @fresh="getUser" />
      </div>
      <div class="text-center left-panel-name">
        {{ user.nickName }}
      </div>
      <div v-if="user.org.orgName" class="text-center left-panel-org">
        {{ user.org.orgName }}
      </div>
      <ul class="list-group list-group-striped">
        <li class="list-group-item">
          手机号码
          <div class="pull-right">{{ user.phonenumber }}</div>
        </li>
        <li class="list-group-item">
          用户邮箱
          <div class="pull-right">{{ user.email }}</div>
        </li>
        <li class="list-group-item">
          所属组织
          <div v-if="user.org" class="pull-right">{{ user.org.orgName }}</div>
        </li>
        <li class="list-group-item">
          所属角色
          <div class="pull-right">{{ roleGroup }}</div>
        </li>
        <li class="list-group-item">
          创建日期
          <div class="pull-right">{{ user.createTime }}</div>
        </li>
      </ul>
    </div>
    <div class="right-panel app-container ly-flex-1">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本资料" name="userinfo">
          <userInfo :user="user" />
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="resetPwd">
          <resetPwd :user="user" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import userAvatar from './userAvatar';
import userInfo from './userInfo';
import resetPwd from './resetPwd';
import { getUserProfile } from '@/api/system/user';

export default {
  name: 'Profile',
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: 'userinfo'
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-index{
  height: calc(100% - 15px);
  flex-wrap: wrap;
  margin: 0 0 15px 15px;
  >.left-panel{
    width: 368px;
    min-height: 100%;
    margin: 0 15px 15px 0;
    .left-panel-name{
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 22px;
      color: #262626;
    }
    .left-panel-org{
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 22px;
      color: #909398;
      margin-top: 3px;
    }
  }
  >.right-panel{
    width: calc(100% - 398px);
    height: 370px;
    min-width: 368px;
    margin: 0 15px 0 0;
  }
}
</style>
