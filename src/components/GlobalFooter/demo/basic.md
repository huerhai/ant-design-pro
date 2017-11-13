---
order: 0
title: 演示
iframe: 400
---

基本页脚。

````jsx
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';
import { Icon } from 'antd';

const links = [{
  title: '帮助',
  href: '',
}, {
  title: '隐私',
  href: '',
}, {
  title: '条款',
  href: '',
  blankTarget: true,
}];

const copyright = <div>Copyright <Icon type="copyright" /> 2017 上海栈略数据技术有限公司 (蚂蚁金服脚手架)</div>;

ReactDOM.render(
  <div style={{ background: '#f5f5f5', overflow: 'hidden' }}>
    <div style={{ height: 280 }} />
    <GlobalFooter links={links} copyright={copyright} />
  </div>
, mountNode);
````
