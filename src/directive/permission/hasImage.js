/**
 * 图片加载失败显示默认图片
 */
export default {
  async inserted(el, binding) {
    const imgURL = binding.value;
    if (imgURL) {
      const exist = await imageIsExist(imgURL);
      if (exist) {
        el.setAttribute('src', imgURL);
      }
    }
  }
};

// 检测图片是否存在
const imageIsExist = function(url) {
  return new Promise((resolve) => {
    var img = new Image();
    img.onload = function() {
      if (this.complete) {
        resolve(true);
        img = null;
      }
    };
    img.onerror = function() {
      resolve(false);
      img = null;
    };
    img.src = url;
  });
};
