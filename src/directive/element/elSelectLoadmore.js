/**
 * elementUI select 滚动分页
 * Copyright (c) 2021 ddc
 */

export default {
  inserted(el, binding, vnode) {
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
    SELECTWRAP_DOM.addEventListener('scroll', function() {
      const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (condition) {
        binding.value();
      }
    });
  }
};
