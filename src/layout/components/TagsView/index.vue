<template>
  <div id="tags-view-container" ref="TagsViewContainer" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        :style="activeStyle(tag)"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>

    <!-- <el-dropdown ref="TagsDerpDown" class="btn-arrow-container" trigger="click">
      <div class="btn-arrow el-icon-arrow-down" />
      <el-dropdown-menu slot="dropdown" class="tags-dropdown">
        <router-link
          v-for="tag in overflowTagsList"
          :key="tag.path"
          :class="isActive(tag)?'tags-dropdown-item-active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          <el-dropdown-item>
            {{ tag.title }}
            <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item v-show="overflowTagsList.length==0" disabled>暂无更多</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->

    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import path from 'path';
import ScrollPane from './ScrollPane';
// import { ThrottleFun } from '@/utils/index.js';
export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      overflowTagsList: []
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    routes() {
      return this.$store.state.permission.routes;
    },
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
      // this.$nextTick(() => {
      //   this.tagsOverflow();
      // });
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    }
  },
  mounted() {
    this.initTags();
    this.addTags();
    // this.$nextTick(() => {
    //   this.tagsOverflow();
    // });
    // const throttle = ThrottleFun(this.tagsOverflow, 300);
    // window.onresize = () => {
    //   this.$refs.TagsDerpDown.hide();
    //   throttle();
    // };
  },
  // beforeDestroy() {
  //   window.onresize = null;
  // },
  methods: {
    isActive(route) {
      return route.path === this.$route.path;
    },
    activeStyle(tag) {
      if (!this.isActive(tag)) return {};
      return {
        'background-color': this.theme,
        'border-color': this.theme
      };
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix;
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = [];
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes);
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag);
        }
      }
    },
    addTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route);
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          });
        });
      });
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view);
        }
      });
      // this.$nextTick(() => {
      //   this.tagsOverflow();
      //   if (this.overflowTagsList.length === 0) {
      //     this.$refs.TagsDerpDown.hide();
      //   }
      // });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === this.$route.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath });
        } else {
          this.$router.push('/');
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    handleScroll() {
      this.closeMenu();
    },
    tagsOverflow() {
      const $ContainerWidth = this.$refs.TagsViewContainer.offsetWidth;
      const tagList = this.$refs.tag;
      let tagswidth = 0;
      let index;
      let flag = true;
      for (let i = 0; i < tagList.length; i++) {
        tagswidth += tagList[i].$el.clientWidth;
        // 44: The width of a arrow
        if (flag && (tagswidth > $ContainerWidth - 44)) {
          flag = false;
          index = i;
          this.overflowTagsList = this.visitedViews.slice(index);
        }
      }
      if (tagswidth < $ContainerWidth - 44) {
        this.overflowTagsList = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 44px;
  width: 100%;
  background: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 9px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .btn-arrow-container{
    float: right;
  }
  .btn-arrow{
    position: relative;
    height: 100%;
    width: 44px;
    color: #666;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    &::after{
      content: '|';
      position: absolute;
      left: -1px;
      top: 0;
      color: #CCCCCC;
      font-size: 12px;
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
@mixin tag-icon-close {
  width: 16px;
  height: 16px;
  vertical-align: 2px;
  border-radius: 50%;
  text-align: center;
  transition: all .3s cubic-bezier(.645, .045, .355, 1);
  transform-origin: 100% 50%;
  &:before {
    transform: scale(.6);
    display: inline-block;
    vertical-align: -3px;
  }
  &:hover {
    background-color: #b4bccc;
    color: #fff;
  }
}
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      @include tag-icon-close
    }
  }
}
// .tags-dropdown {
//   .tags-dropdown-item-active {
//     position: relative;
//     .el-dropdown-menu__item {
//       color: #409eff;
//       background: rgba(64, 158, 255, 0.1);
//     }
//     // &::after {
//     //   position: absolute;
//     //   top: 0;
//     //   left: 0;
//     //   right: 0;
//     //   bottom: 0;
//     //   content: '';
//     //   pointer-events: none;
//     //   background: $theme;
//     //   opacity: 0.1;
//     // }
//   }
//   .el-icon-close {
//     margin-left: 6px;
//     @include tag-icon-close
//   }
// }
</style>
