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
      { title: '账号',
        dataIndex: '账号',
      },
      { title: '姓名',
        dataIndex: '姓名',
      },
      { title: '公司属性',
        dataIndex: '公司属性',
      },
      { title: '所属公司',
        dataIndex: '所属公司',
      },
      {
        title: '操作',
        render: (_, obj) => (
          <p>
            <a onClick={() => { onEdit(obj); }}>修改</a>
            <span className={styles.splitLine} />
            <Popconfirm title={`你确定要删除[${obj.公司名}]这个用户吗?`} onConfirm={() => onDelete(obj)} okText="确定" cancelText="取消">
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
