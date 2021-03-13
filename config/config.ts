// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV, LOCATIONIQ_ACCESS_TOKEN } = process.env;
const GLOBAL_ENV = {
  // API_BASE: "https://location-base-advertising.herokuapp.com",
  API_BASE: "https://localhost:14333/",
  LOCATIONIQ_ACCESS_TOKEN: LOCATIONIQ_ACCESS_TOKEN || "pk.3ca283b2e5ac56b587e3193483a29f24"
}
export default defineConfig({
  
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
     
  },
  define: {
    ...GLOBAL_ENV
  },
  locale: {
    // default zh-CN
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
});
