import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Select, List, Card, Row, Col, Radio, Input, Progress, Icon, Dropdown, Menu, Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardFormRow from '../../components/StandardFormRow';
import TagSelect from '../../components/TagSelect';

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
  componentDidMount() {
    this.props.dispatch({
      type: 'preList/fetch',
      payload: {
        count: 5,
      },
    });
  }

  render() {
    const { preList: { list, loading } } = this.props;

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">待审</RadioButton>
          <RadioButton value="waiting">已审</RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="被保人"
          onSearch={() => ({})}
        />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({ data: { tpa, para2, modifiedBy, createdAt, riskScore } }) => {
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
          <div>
            <span>录入方:{tpa}</span>
            <p>所属公司:{para2}</p>
          </div>
          <div>
            <span>最后修改人</span>
            <p>{lastName}</p>
          </div>
          <div>
            <span>创建时间</span>
            <p>{moment(createdAt).format('YYYY-MM-DD hh:mm')}</p>
          </div>
          <div>
            <Progress percent={riskScore || 0} strokeWidth={6} />
          </div>
        </div>);
    };

    const menu = (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a>删除</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );
    const ListTitle = ({ riskDimension, description }) => {
      let temp = '';
      if (riskDimension) temp = `${temp}维度:${riskDimension}`;
      if (description) temp = `${temp} 描述:${description}`;
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
                  actions={[<a>编辑</a>, <a>影像</a>, <MoreBtn />]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={icon(item).icon} shape="square" size="large" style={icon(item).style} />}
                    title={<a href={item.href}>{item.para1} {item.claimId} </a>}
                    description={ListTitle(item)}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
