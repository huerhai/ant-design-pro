/**
 * Created by liwenjie on 2017/11/10.
 */
import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './list.less';

class StandardTable extends PureComponent {
  state = {
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  render() {
    const { data: { list, pagination }, loading } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
        fixed: 'left',
        render: (_, obj, index) => index + 1,
      },
      {
        title: '被保人姓名',
        fixed: 'left',
        dataIndex: '被保人姓名',
      },
      {
        title: '团体名称',
        dataIndex: '团体名称',
      },
      {
        title: '团体保单号',
        dataIndex: '团体保单号',
      },
      {
        title: '保险公司',
        dataIndex: '保险公司',
      },
      {
        title: '个人保单号',
        dataIndex: '个人保单号',
      },
      {
        title: '产品名称',
        dataIndex: '产品名称',
      },
      {
        title: '层级',
        dataIndex: '层级',
      },
      {
        title: '被保人属性',
        dataIndex: '被保人属性',
      },
      {
        title: '出生年月',
        dataIndex: '出生年月',
      },
      {
        title: '性别',
        dataIndex: '性别',
      },
      {
        title: '证件类型',
        dataIndex: '证件类型',
      },
      {
        title: '被保人身份证',
        dataIndex: '被保人身份证',
      },
      {
        title: '医保类型',
        dataIndex: '医保类型',
      },
      {
        title: '医保卡号',
        dataIndex: '医保卡号',
      },
      {
        title: '剩余保费',
        dataIndex: '剩余保费',
      },
      {
        title: '初期保费',
        dataIndex: '初期保费',
      },
      {
        title: '银行账号',
        dataIndex: '银行账号',
      },
      {
        title: '开户行',
        dataIndex: '开户行',
      },
      {
        title: '保单生效日',
        dataIndex: '保单生效日',
      },
      {
        title: '保单终止日',
        dataIndex: '保单终止日',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          scroll={{ x: 2300 }}
          loading={loading}
          rowKey={record => record.key}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
