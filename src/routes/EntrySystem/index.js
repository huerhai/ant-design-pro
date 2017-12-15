/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Select, List, Card, Radio, Input, message } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';


@Form.create()
@connect(state => ({
  preList: state.preList,
}))
export default class BasicList extends PureComponent {
  state = {
    filter: {
      active: true,
      page: this.props.preList.page || 0,
      size: 10,
      pretreatmentStatus: '0',
    },
  };
  componentDidMount() {
    this.fetch();
  }
  fetch(newFilter) {
    const { form } = this.props;
    setTimeout(() => {
      form.validateFields((err) => {
        if (!err) {
          let filter = {
            ...this.state.filter,
            active: true,
            ...form.getFieldsValue(),
            ...newFilter,
          };
          if (filter) {
            filter = {
              ...filter,
              para2: filter.para2 ?
                (filter.para2.length === 2 ?
                  undefined :
                  filter.para2.join()) :
                undefined,
              tpa: filter.tpa ?
                (filter.tpa.length === 2 ?
                  undefined :
                  filter.tpa.join()) :
                undefined,
            };
          }
          this.setState({ filter });
          this.props.dispatch({
            type: 'preList/fetch',
            payload: filter,
          });
        }
      });
    }, 0);
  }
  handleFormSubmit = () => {
    this.fetch({ page: 0 });
  }

  render() {
    const { preList: { list, loading, total }, dispatch } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.state.filter.size,
      current: this.state.filter.page + 1,
      total,
      onChange: (page, pageSize) => {
        this.setState({
          filter: {
            ...this.state.filter,
            page: page - 1,
            size: pageSize,
          },
        });
        this.fetch();
      },
    };

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            title="可领取任务"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a onClick={() => {
                      window.open(`/#/case/entry/input?claimId=${item.claimId}`);
                    }}
                    >
                      领取
                    </a>,
                    <a onClick={() => {
                      window.open(
                        `/gw/am/attachment/getclaimFileByCalimId?claimId=${item.claimId}`
                      );
                    }}
                    >
                      影像
                    </a>]}
                >
                  <List.Item.Meta
                    title={item.claimId}
                    description="预计工作量:15分钟 影像件大小:37M"
                  />
                </List.Item>
              )}
            />
          </Card>
          <Card
            className={styles.listCard}
            title="我的任务"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a onClick={() => {
                      window.open(`/#/case/entry/input?claimId=${item.claimId}`);
                      }}
                    >
                      录入
                    </a>,
                    <a onClick={() => {
                      window.open(
                        `/gw/am/attachment/getclaimFileByCalimId?claimId=${item.claimId}`
                      );
                    }}
                    >
                      影像
                    </a>,
                    <a>完成</a>]}
                >
                  <List.Item.Meta
                    title={item.claimId}
                    description="已录入 2个事件 5张收据 300行清单"
                  />
                </List.Item>
              )}
            />
          </Card>
          <Card
            className={styles.listCard}
            title="已完成任务"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a onClick={() => {
                      window.open(`/#/case/entry/input?claimId=${item.claimId}`);
                    }}
                    >
                      重录
                    </a>,
                    <a onClick={() => {
                      window.open(
                        `/gw/am/attachment/getclaimFileByCalimId?claimId=${item.claimId}`
                      );
                    }}
                    >
                      影像
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.claimId}
                    description="用时 17 分钟"
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
