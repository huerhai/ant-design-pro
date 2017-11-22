import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Select, List, Card, Row, Col, Radio, Input, Progress, Icon, Dropdown, Menu, Avatar, message } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardFormRow from '../../components/StandardFormRow';
import TagSelect from '../../components/TagSelect';

import EditModal from './modle';
import styles from './BasicList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const { Option } = Select;
const { Search } = Input;

@Form.create()
@connect(state => ({
  preList: state.preList,
}))
export default class BasicList extends PureComponent {
  state = {
    currentItem: {},
    modalVisible: false,
    filter: {},
  };
  componentDidMount() {
    this.fetch();
  }
  fetch(newFilter) {
    this.setState({
      filter: { ...this.state.filter, ...newFilter },
    });
    this.props.dispatch({
      type: 'preList/fetch',
      payload: { ...this.state.filter, ...newFilter },
    });
  }

  render() {
    const { preList: { list, loading } } = this.props;
    const { modalVisible } = this.state;

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup
          defaultValue={undefined}
          onChange={(e) => {
            this.fetch({ pretreatmentStatus: e.target.value });
          }}
        >
          <RadioButton value={undefined}>全部</RadioButton>
          <RadioButton value="0">待审</RadioButton>
          <RadioButton value="1">已审</RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="赔案号"
          onSearch={value => this.fetch({ claimId: value })}
        />
      </div>
    );

    const handleEdit = (data) => {
      this.props.dispatch({
        type: 'preList/update',
        payload: data,
        callback: () => {
          message.success('修改成功');
        },
      });
      this.setState({
        modalVisible: false,
      });
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent =
      ({ data: {
        tpa,
        para2,
        modifiedBy,
        createdAt, modifiedAt,
        riskScore,
        pretreatmentStatus,
      },
      }) => {
        let lastName = '管理员';
        switch (modifiedBy) {
          case -1:
            lastName = '-';
            break;
          case -4:
            lastName = '神秘人';
            break;
          case -7:
            lastName = '罗咏梅';
            break;
          case -6:
            lastName = '曾朝霞';
            break;
          default:
            break;
        }
        return (
          <div className={styles.listContent}>
            <div style={{ width: 110 }}>
              <p>录入方:{tpa}</p>
              <p>所属公司:{para2}</p>
              <p>修改人:{lastName}</p>
            </div>
            <div>
              <p>{moment(createdAt).format('YYYY-MM-DD hh:mm')}</p>
              <p>{moment(modifiedAt).format('YYYY-MM-DD hh:mm')}</p>
              <p>{pretreatmentStatus === '1' ? '已审' : '待审' }</p>
            </div>
            <div>
              <Progress percent={riskScore * 100 || 0} strokeWidth={6} format={percent => `${percent / 100}`} />
            </div>
          </div>);
      };

    const menu = item => (
      <Menu onClick={(menuItem) => {
        switch (menuItem.key) {
          case '1':
            this.props.dispatch({
              type: 'preList/publish',
              payload: { ...item },
              callback: () => {
                message.success('发布成功');
              },
            });
            break;
          case '2':
            this.props.dispatch({
              type: 'preList/delete',
              payload: { ...item },
              callback: () => {
                message.success('删除成功');
              },
            });
            break;
          default:
            break;
        }
      }}
      >
        {item.pretreatmentStatus !== '1' ?
          <Menu.Item key="1">
            <a>发布</a>
          </Menu.Item> : null
        }
        <Menu.Item key="2">
          <a>删除</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = ({ item }) => (
      <Dropdown overlay={menu(item)}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );
    const ListTitle = ({ riskDimension, description, suggestion }) => {
      let temp = '';
      if (riskDimension) temp = ` ┃ 维度:${riskDimension}`;
      if (description) temp = `${temp} ┃ 场景:${description}`;
      if (suggestion) temp = `${temp} ┃ 描述:${suggestion}`;
      return temp;
    };
    const icon = ({ riskLevel }) => {
      switch (riskLevel) {
        case '高':
          return {
            icon: 'frown',
            style: { color: '#fd3244', backgroundColor: '#fde3cf' },
          };
        case '中':
          return {
            icon: 'meh',
            style: { color: '#f56a00', backgroundColor: '#fde3cf' },
          };
        case '低':
          return {
            icon: 'smile',
            style: { color: '#d3f59e', backgroundColor: '#fde3cf' },
          };
        default:
          return {
            icon: 'question-circle',
            style: { color: '#eeeeee', backgroundColor: '#d8d8d8' },
          };
      }
    };
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Form layout="inline">
              <StandardFormRow title="所属公司" block style={{ paddingBottom: 11 }}>
                <FormItem>
                  {getFieldDecorator('category')(
                    <TagSelect onChange={this.handleFormSubmit} expandable>
                      <TagSelect.Option value="cat1">易安</TagSelect.Option>
                      <TagSelect.Option value="cat2">江苏人保财</TagSelect.Option>
                    </TagSelect>
                  )}
                </FormItem>
              </StandardFormRow>
              <StandardFormRow title="录入方" block style={{ paddingBottom: 11 }}>
                <FormItem>
                  {getFieldDecorator('category')(
                    <TagSelect onChange={this.handleFormSubmit} expandable>
                      <TagSelect.Option value="世博">世博</TagSelect.Option>
                      <TagSelect.Option value="普康">普康</TagSelect.Option>
                    </TagSelect>
                  )}
                </FormItem>
              </StandardFormRow>
              <StandardFormRow title="审核员" block style={{ paddingBottom: 11 }}>
                <FormItem>
                  {getFieldDecorator('category')(
                    <TagSelect onChange={this.handleFormSubmit} expandable>
                      <TagSelect.Option value="未分配">未分配</TagSelect.Option>
                      <TagSelect.Option value="曾朝霞">曾朝霞</TagSelect.Option>
                      <TagSelect.Option value="罗咏梅">罗咏梅</TagSelect.Option>
                      <TagSelect.Option value="其他">其他</TagSelect.Option>
                    </TagSelect>
                  )}
                </FormItem>
              </StandardFormRow>
              <StandardFormRow
                title="其它选项"
                grid
                last
              >
                <Row gutter={16}>
                  <Col lg={8} md={10} sm={10} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label="风险等级"
                    >
                      {getFieldDecorator('author', {})(
                        <Select
                          onChange={this.handleFormSubmit}
                          placeholder="不限"
                          style={{ maxWidth: 200, width: '100%' }}
                        >
                          <Option value="高">高</Option>
                          <Option value="中">中</Option>
                          <Option value="低">低</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={8} md={10} sm={10} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label="风险维度"
                    >
                      {getFieldDecorator('rate', {})(
                        <Select
                          onChange={this.handleFormSubmit}
                          placeholder="不限"
                          style={{ maxWidth: 200, width: '100%' }}
                        >
                          <Option value="good">优秀</Option>
                          <Option value="normal">普通</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </StandardFormRow>
            </Form>
          </Card>
          <Card
            className={styles.listCard}
            bordered={false}
            title="预审列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a onClick={() => {
                    this.setState({ modalVisible: true, currentItem: item });
                  }}>
                      编辑
                    </a>,
                    <a onClick={() => {
                      window.open(`/gw/am/attachment/getclaimFileByCalimId?claimId=${item.claimId}`);
                    }}
                    >
                      影像
                    </a>, <MoreBtn item={item} />]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={icon(item).icon} shape="square" size="large" style={icon(item).style} />}
                    title={
                      <a onClick={() => {
                        this.setState({ modalVisible: true, currentItem: item });
                      }}
                      >
                        {item.para1} {item.claimId}
                      </a>}
                    description={ListTitle(item)}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <EditModal
          title="编辑"
          visible={modalVisible}
          item={this.state.currentItem}
          onOk={handleEdit}
          onCancel={() => this.setState({ modalVisible: false })}
        />
      </PageHeaderLayout>
    );
  }
}
