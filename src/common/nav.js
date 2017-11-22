/* eslint-disable no-unused-vars */
import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '影像件导入',
        path: 'todo',
        icon: 'scan',
        component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
      },
      {
        name: '数据导入',
        path: 'input',
        icon: 'solution',
        component: dynamicWrapper(app, ['group'], () => import('../routes/EntrySystem/universalInput')),
      },
      {
        name: '预审',
        path: 'preliminary',
        icon: 'customer-service',
        component: dynamicWrapper(app, ['preList'], () => import('../routes/Preliminary/BasicList')),
      },
      {
        name: '保险公司管理',
        path: 'company',
        icon: 'usb',
        component: dynamicWrapper(app, ['company'], () => import('../routes/BasicInfo/company')),
      },
      {
        name: '产品管理',
        path: 'product',
        icon: 'bars',
        component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
      },
      {
        name: '团体管理',
        path: 'Group',
        icon: 'team',
        component: dynamicWrapper(app, ['group'], () => import('../routes/BasicInfo/group')),
      },
      {
        name: '保单管理',
        path: 'Policies',
        icon: 'copy',
        component: dynamicWrapper(app, ['policy'], () => import('../routes/BasicInfo/policy')),
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
          },
          {
            name: '注册',
            path: 'register',
            component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
          },
          {
            name: '注册结果',
            path: 'register-result',
            component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
    layout: 'BlankLayout',
    children: {
      name: '使用文档',
      path: 'http://pro.ant.design/docs/getting-started',
      target: '_blank',
      icon: 'book',
    },
  },
];
