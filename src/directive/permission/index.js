import hasRole from './hasRole';
import hasPermi from './hasPermi';
import hasImage from './hasImage';

const install = function(Vue) {
  Vue.directive('hasRole', hasRole);
  Vue.directive('hasPermi', hasPermi);
  Vue.directive('real-img', hasImage);
};

if (window.Vue) {
  window['hasRole'] = hasRole;
  window['hasPermi'] = hasPermi;
  Vue.use(install); // eslint-disable-line
}

export default install;
