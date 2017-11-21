/* eslint-disable no-unused-vars */
import dynamic from 'dva/dynamic';

// models
import UserModel from '../models/user';
import ChartModel from '../models/chart';
import MonitorModel from '../models/monitor';
import ProjectModel from '../models/project';
import ActivitiesModel from '../models/activities';
import FormModel from '../models/form';
import RuleModel from '../models/rule';
import ListModel from '../models/list';
import ProfileModel from '../models/profile';
import LoginModel from '../models/login';
import RegisterModel from '../models/register';

import CompanyModel from '../models/company';
import GroupModel from '../models/group';
import PolicyModel from '../models/policy';

// components
import BasicLayout from '../layouts/BasicLayout';
import UserLayout from '../layouts/UserLayout';
import BlankLayout from '../layouts/BlankLayout';

import Analysis from '../routes/Dashboard/Analysis';
import Monitor from '../routes/Dashboard/Monitor';
import Workplace from '../routes/Dashboard/Workplace';

import BasicForm from '../routes/Forms/BasicForm';
import AdvancedForm from '../routes/Forms/AdvancedForm';
import StepForm from '../routes/Forms/StepForm';
import Step2 from '../routes/Forms/StepForm/Step2';
import Step3 from '../routes/Forms/StepForm/Step3';

import TableList from '../routes/List/TableList';
import BasicList from '../routes/List/BasicList';
import CardList from '../routes/List/CardList';
import CoverCardList from '../routes/List/CoverCardList';
import FilterCardList from '../routes/List/FilterCardList';
import SearchList from '../routes/List/SearchList';

import BasicProfile from '../routes/Profile/BasicProfile';
import AdvancedProfile from '../routes/Profile/AdvancedProfile';

import Success from '../routes/Result/Success';
import Error from '../routes/Result/Error';
import Exception403 from '../routes/Exception/403';
import Exception404 from '../routes/Exception/404';
import Exception500 from '../routes/Exception/500';

import Login from '../routes/User/Login';
import Register from '../routes/User/Register';
import RegisterResult from '../routes/User/RegisterResult';

import EntryForm from '../routes/EntrySystem/entry';

import Company from '../routes/BasicInfo/company';
import Group from '../routes/BasicInfo/group';
import Policy from '../routes/BasicInfo/policy';
import UniversalInput from '../routes/EntrySystem/universalInput';

// wrapper of dynamic
const dy = (app, models, component) => dynamic({
  app,
  models: () => models,
  component: () => component,
});

// nav data
export const getNavData = app => [
  {
    component: dy(app, [UserModel], BasicLayout),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '影像件导入',
        path: 'todo',
        icon: 'scan',
        component: dy(app, [RuleModel], TableList),
      }, {
        name: '数据导入',
        path: 'input',
        icon: 'solution',
        component: dy(app, [GroupModel], UniversalInput),
      },
      {
        name: '保险公司管理',
        path: 'company',
        icon: 'usb',
        component: dy(app, [CompanyModel], Company),
      }, {
        name: '产品管理',
        path: 'product',
        icon: 'bars',
        component: dy(app, [RuleModel], TableList),
      }, {
        name: '团体管理',
        path: 'Group',
        icon: 'team',
        component: dy(app, [GroupModel], Group),
      }, {
        name: '保单管理',
        path: 'Policies',
        icon: 'copy',
        component: dy(app, [PolicyModel], Policy),
      },
    ],
  },
  {
    component: dy(app, [], UserLayout),
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
            component: dy(app, [LoginModel], Login),
          },
          {
            name: '注册',
            path: 'register',
            component: dy(app, [RegisterModel], Register),
          },
          {
            name: '注册结果',
            path: 'register-result',
            component: dy(app, [], RegisterResult),
          },
        ],
      },
    ],
  },
  {
    component: dy(app, [], BlankLayout),
    layout: 'BlankLayout',
    children: {
      name: '使用文档',
      path: 'http://pro.ant.design/docs/getting-started',
      target: '_blank',
      icon: 'book',
    },
  },
];
