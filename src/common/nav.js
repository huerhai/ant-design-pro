import BasicLayout from '../layouts/BasicLayout';
// import UserLayout from '../layouts/UserLayout';
// import BlankLayout from '../layouts/BlankLayout';
//
// import Analysis from '../routes/Dashboard/Analysis';
// import Monitor from '../routes/Dashboard/Monitor';
// import Workplace from '../routes/Dashboard/Workplace';

import TableList from '../routes/List/TableList';
// import CoverCardList from '../routes/List/CoverCardList';
// import CardList from '../routes/List/CardList';
// import FilterCardList from '../routes/List/FilterCardList';
// import SearchList from '../routes/List/SearchList';
// import BasicList from '../routes/List/BasicList';
//
// import BasicProfile from '../routes/Profile/BasicProfile';
// import AdvancedProfile from '../routes/Profile/AdvancedProfile';
//
// import BasicForm from '../routes/Forms/BasicForm';
// import AdvancedForm from '../routes/Forms/AdvancedForm';
// import StepForm from '../routes/Forms/StepForm';
// import Step2 from '../routes/Forms/StepForm/Step2';
// import Step3 from '../routes/Forms/StepForm/Step3';
//
// import Exception403 from '../routes/Exception/403';
// import Exception404 from '../routes/Exception/404';
// import Exception500 from '../routes/Exception/500';
//
// import Success from '../routes/Result/Success';
// import Error from '../routes/Result/Error';
//
// import Login from '../routes/User/Login';
// import Register from '../routes/User/Register';
// import RegisterResult from '../routes/User/RegisterResult';

import Company from '../routes/BasicInfo/company';
import Group from '../routes/BasicInfo/group';

const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [{
    name: '录入系统',
    path: 'leapStack',
    icon: 'form',
    children: [{
      name: '待审核',
      path: 'todo',
      component: TableList,
    }, {
      name: '已审核',
      path: 'approved',
      component: TableList,
    }],
  }, {
    name: '栈略数据',
    path: 'leapStack',
    icon: 'form',
    children: [{
      name: '待审核',
      path: 'todo',
      component: TableList,
    }, {
      name: '已审核',
      path: 'approved',
      component: TableList,
    }],
  }, {
    name: '基础信息',
    path: 'basicInfo',
    icon: 'form',
    children: [{
      name: '保险公司管理',
      path: 'company',
      component: Company,
    }, {
      name: '产品管理',
      path: 'product',
      component: TableList,
    }, {
      name: '团体管理',
      path: 'Group',
      component: Group,
    }, {
      name: '保单管理',
      path: 'Policies',
      component: TableList,
    }],
  }, {
    name: '易安保险公司',
    path: 'yian',
    icon: 'form',
    children: [{
      name: '待审核',
      path: 'Check',
      component: TableList,
    }, {
      name: '已审核',
      path: 'Archiving',
      component: TableList,
    }],
  }],
}];

export function getNavData() {
  return data;
}

export default data;
