export default {
  data() {
    return {
      numberToPxMap: {
        'width': true,
        'height': true,
        'top': true,
        'left': true,
        'font-size': true,
        'letter-spacing': true,
        'line-height': true,
        'border-radius': true,
        'border-width': true
      },
      removePropertyMap: {
        'position': true,
        'top': true,
        'left': true
      }
    };
  },
  methods: {
    numberToPx(obj) {
      const style = Object.assign({}, obj);
      const { isFitWidth, isFitHeight, isFitTop, isFitLeft } = style;
      for (const key in style) {
        if (key === 'width' && isFitWidth) {
          style[key] = style[key] + isFitWidth;
        } else if (key === 'height' && isFitHeight) {
          style[key] = style[key] + isFitHeight;
        } else if (key === 'top' && isFitTop) {
          style[key] = style[key] + isFitTop;
        } else if (key === 'left' && isFitLeft) {
          style[key] = style[key] + isFitLeft;
        } else if (this.numberToPxMap[key]) {
          style[key] = style[key] + 'px';
        }
      }
      if (isFitWidth) delete style[isFitWidth];
      if (isFitHeight) delete style[isFitHeight];
      if (isFitTop) delete style[isFitTop];
      if (isFitLeft) delete style[isFitLeft];
      return style;
    },
    removePosition(obj) {
      const style = Object.assign({}, obj);
      for (const key in style) {
        if (this.removePropertyMap[key]) {
          delete style[key];
        }
      }
      return style;
    }
  }
};
