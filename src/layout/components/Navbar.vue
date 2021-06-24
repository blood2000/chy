<template>
  <div class="navbar">
    <img class="navbar__logo" src="@/assets/images/navBar/logo.png" @click="goToStatistic">

    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <el-tooltip content="官网地址" effect="dark" placement="bottom">
          <ddc-yi-doc id="ddc-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

      </template>

      <div class="avatar-wrapper">
        <img v-real-img="avatar" src="@/assets/images/workbench/icon_noavator.png" class="avatar-wrapper__image">
        <span v-if="roleName !== ''" class="avatar-wrapper__role">{{ roleName }}</span>
      </div>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span class="avatar-wrapper__user">{{ nickName || name }}</span>
          <span class="avatar-wrapper__icon" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <!-- <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <quick-entry />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import QuickEntry from './QuickEntry';
// import Breadcrumb from '@/components/Breadcrumb';
// import Hamburger from '@/components/Hamburger';
// import Screenfull from '@/components/Screenfull';
// import SizeSelect from '@/components/SizeSelect';
// import Search from '@/components/HeaderSearch';
// import DdcYiDoc from '@/components/Ddc/Doc';

export default {
  components: {
    QuickEntry
    // Breadcrumb,
    // Hamburger
    // Screenfull,
    // SizeSelect,
    // Search,
    // DdcYiDoc
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'nickName',
      'name',
      'roleName',
      'isShipment'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        });
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        });
      });
    },
    goToStatistic() {
      if (this.isShipment) return;
      const routeData = this.$router.resolve({
        // path: '/statistic',
        path: '/statisticSecond',
        query: {
          isScale: true
        }
      });
      window.open(routeData.href, '_blank');
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  // 70: headerHeight
  height: 70px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(270deg, #409EFF 0%, #0571D8 100%);
  box-shadow: 0px 3px 6px rgba(64, 158, 255, 0.22);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  &__logo{
    float: left;
    width: 134px;
    height: 36px;
    margin: 18px 10px 18px 24px;
    cursor: pointer;
  }

  .hamburger-container {
    // 70: headerHeight
    line-height: 70px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
    padding-top: 7px;
  }


  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    // 70: headerHeight
    line-height: 70px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 20px;
      cursor: default;
      background: transparent !important;
    }

    .avatar-wrapper {
      position: relative;
      height: 100%;
      float: left;

      &__image {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        vertical-align: middle;
      }

      &__role{
        padding: 0 12px 0 10px;
        font-size: 14px;
        font-family: PingFang SC;
        color: #FFFFFF;
        vertical-align: middle;
        position: relative;
        &::after{
          content: '';
          width: 1px;
          height: 12px;
          position: absolute;
          top: 50%;
          margin-top: -6px;
          right: 0;
          background: #fff;
          font-size: 14px;
          opacity: 0.4;
        }
      }

      &__user{
        margin: 0 6px 0 2px;
        font-size: 14px;
        font-family: PingFang SC;
        color: #FFFFFF;
        font-weight: bold;
        vertical-align: middle;
      }

      &__icon {
        display: inline-block;
        width: 12px;
        height: 16px;
        background: url('~@/assets/images/navBar/avatar_icon.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        position: absolute;
        right: -12px;
        top: 50%;
        margin-top: -7px;
      }
    }
  }
}
</style>
