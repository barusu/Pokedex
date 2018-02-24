import message from './message.js';
import oSvg from './svg';
import oSwitch from './switch';
import oInput from './input';
import oButton from './button';

const install = function(Vue) {
  Vue.prototype.$msg = message;
  Vue.component('oSvg', oSvg);
  Vue.component('oSwitch', oSwitch);
  Vue.component('oInput', oInput);
  Vue.component('oButton', oButton);
};

export default {
  install
};