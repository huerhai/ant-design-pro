import React from 'react';
import styles from './PageHeaderLayout.less';

export default ({ children, wrapperClassName, top }) => (
  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
);
