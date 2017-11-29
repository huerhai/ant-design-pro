import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';

import logo from '../assets/栈略Logo.png';

const links = [{
  title: '帮助',
  href: '#/user/login',
}, {
  title: '隐私',
  href: '#/user/login',
}, {
  title: '条款',
  href: '#/user/login',
}];

const copyright = <div>Copyright <Icon type="copyright" /> 2017 上海栈略数据技术有限公司 (蚂蚁金服脚手架)</div>;

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  getChildContext() {
    const { location } = this.props;
    return { location };
  }
  getPageTitle() {
    const { getRouteData, location } = this.props;
    const { pathname } = location;
    let title = '商保2.0';
    getRouteData('UserLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - 商保2.0`;
      }
    });
    return title;
  }
  render() {
    const { getRouteData } = this.props;

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="" className={styles.logo} src={logo} />
                <span className={styles.title}>保险理赔系统</span>
              </Link>
            </div>
            <div className={styles.desc}>您正在使用的是 Beta2.0.1版本</div>
          </div>
          {
            getRouteData('UserLayout').map(item =>
              (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />
              )
            )
          }
          <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
