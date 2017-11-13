/**
 * Created by liwenjie on 2017/11/10.
 */
import React, { PureComponent } from 'react';
import { Table, Popconfirm } from 'antd';
import styles from './list.less';

class StandardTable extends PureComponent {
  state = {
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  render() {
    const { onEdit, onDelete, data: { list, pagination }, loading } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
        render: (_, obj, index) => index + 1,
      },
      { title: '团体编号',
        dataIndex: '团体编号',
      },
      { title: '团体名称',
        dataIndex: '团体名称',
      },
      { title: '产品名称',
        dataIndex: '产品名称',
      },
      { title: '联系人',
        dataIndex: '联系人',
      },
      { title: '联系电话',
        dataIndex: '联系电话',
      },
      { title: '理赔时效',
        dataIndex: '理赔时效',
      },
      { title: '所属保险公司',
        dataIndex: '所属保险公司',
      },
      {
        title: '操作',
        render: (_, obj) => (
          <p>
            <a onClick={() => { onEdit(obj); }}>修改</a>
            <span className={styles.splitLine} />
            <Popconfirm title={`你确定要删除[${obj.公司名}]这个公司吗?`} onConfirm={() => onDelete(obj)} okText="确定" cancelText="取消">
              <a href="#">删除</a>
            </Popconfirm>
          </p>
        ),
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
