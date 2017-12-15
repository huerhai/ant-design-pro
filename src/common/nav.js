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
        name: '首页',
        icon: 'dashboard',
        path: 'workplace',
        component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Home/Workplace')),
      },
      {
        name: '系统设置',
        icon: 'copy',
        path: 'system',
        children: [
          {
            name: '公司管理',
            path: 'company',
            icon: 'usb',
            component: dynamicWrapper(app, ['list'], () => import('../routes/BasicInfo/company/SearchList.js')),
          },
          {
            name: '用户管理',
            path: 'users',
            icon: 'copy',
            component: dynamicWrapper(app, ['group'], () => import('../routes/BasicInfo/user/Userboard.js')),
          },
          {
            name: '角色管理',
            path: 'roles',
            icon: 'copy',
            component: dynamicWrapper(app, ['group'], () => import('../routes/BasicInfo/role/Roleboard.js')),
          },
        ],
      },
      {
        name: '基础信息',
        icon: 'copy',
        path: 'basic',
        children: [
          {
            name: '保险公司管理',
            path: 'company',
            icon: 'usb',
            component: dynamicWrapper(app, ['list'], () => import('../routes/BasicInfo/company/SearchList.js')),
          },
          {
            name: '险种管理',
            path: 'planted',
            icon: 'bars',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
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
        name: '赔案管理',
        icon: 'copy',
        path: 'case',
        children: [
          {
            name: '案件扫描',
            path: 'todo',
            icon: 'scan',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
          },
          {
            name: '扫描质检',
            path: 'zhijian',
            icon: 'scan',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
          },
          {
            name: '案件预审',
            path: 'preliminary',
            icon: 'customer-service',
            component: dynamicWrapper(app, ['preList'], () => import('../routes/Preliminary/BasicList')),
          },
          {
            name: '案件录入',
            path: 'entry',
            icon: 'customer-service',
            children: [
              {
                component: dynamicWrapper(app, ['preList'], () => import('../routes/EntrySystem/index')),
              },
              {
                path: 'input',
                component: dynamicWrapper(app, ['group', 'entry'], () => import('../routes/EntrySystem/universalInput')),
              },
            ],
          },
          {
            name: '录入质检',
            path: 'review1',
            icon: 'customer-service',
            children: [
              {
                component: dynamicWrapper(app, ['caseList'], () => import('../routes/Review/BasicList')),
              },
              {
                path: 'detail',
                component: dynamicWrapper(app, ['caseList', 'claim'], () => import('../routes/CaseDetail/AdvancedProfile')),
              },
            ],
          },
          {
            name: '案件初审',
            path: 'review2',
            icon: 'customer-service',
            children: [
              {
                component: dynamicWrapper(app, ['caseList'], () => import('../routes/Review/BasicList')),
              },
              {
                path: 'detail',
                component: dynamicWrapper(app, ['caseList', 'claim'], () => import('../routes/CaseDetail/AdvancedProfile')),
              },
            ],
          },
          {
            name: '案件复审',
            path: 'review',
            icon: 'customer-service',
            children: [
              {
                component: dynamicWrapper(app, ['caseList'], () => import('../routes/Review/BasicList')),
              },
              {
                path: 'detail',
                component: dynamicWrapper(app, ['caseList', 'claim'], () => import('../routes/CaseDetail/AdvancedProfile')),
              },
            ],
          },
          {
            name: '案件汇总',
            path: 'allCase',
            icon: 'customer-service',
            children: [
              {
                component: dynamicWrapper(app, ['caseList'], () => import('../routes/Review/BasicList')),
              },
              {
                path: 'detail',
                component: dynamicWrapper(app, ['caseList', 'claim'], () => import('../routes/CaseDetail/AdvancedProfile')),
              },
            ],
          },
          {
            name: '导出历史',
            path: 'exportHistory',
            icon: 'solution',
            component: dynamicWrapper(app, ['group'], () => import('../routes/EntrySystem/universalInput')),
          },
          {
            name: '历史案件',
            path: 'history',
            icon: 'customer-service',
            component: dynamicWrapper(app, ['preList'], () => import('../routes/Preliminary/BasicList')),
          },
        ],
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
