import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Select, List, Card, Row, Col, Radio, Input, Icon, Dropdown, Menu, Avatar, message } from 'antd';

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
  caseList: state.caseList,
}))
export default class BasicList extends PureComponent {
  state = {
    currentItem: {},
    currentItemRiskNumber: 1,
    modalVisible: false,
    filter: {
      active: true,
      page: this.props.caseList.page || 0,
      size: 40,
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
              companyId: filter.companyId ?
                (filter.companyId.length === 2 ?
                  undefined :
                  filter.companyId.join()) :
                undefined,
            };
          }
          this.setState({ filter });
          this.props.dispatch({
            type: 'caseList/fetch',
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
    const { caseList: { list, loading, total }, dispatch } = this.props;
    const { modalVisible } = this.state;

    const extraContent = (
      <div className={styles.extraContent}>
        <a
          onClick={() => {
            dispatch({
              type: 'caseList/fresh',
              callback: () => {
                message.success('拉取最新数据');
              },
            });
          }}
          style={{ marginRight: 15 }}
        >
          拉取新数据
        </a>
        <a
          onClick={() => {
            window.open(`/gw/cs/pretreatment/export?fileName=预审导出[${this.state.filter.para2 || '公司不限'}][${this.state.filter.tpa || 'tpa不限'}][${new Date().toLocaleDateString() + new Date().toLocaleTimeString()}].xls&para2=${this.state.filter.para2 || ''}&active=true&tpa=${this.state.filter.tpa || ''}`);
          }}
          style={{ marginRight: 15 }}
        >
          导出
        </a>
        <a
          onClick={() => {
            this.fetch();
          }}
          style={{ marginRight: 15 }}
        >
          刷新
        </a>
        <RadioGroup
          defaultValue="0"
          onChange={(e) => {
            this.fetch({ pretreatmentStatus: e.target.value, page: 0 });
          }}
        >
          <RadioButton value={undefined}>
            全部{!loading && this.state.filter.pretreatmentStatus === undefined && total}
          </RadioButton>
          <RadioButton value="0">待初审{!loading && this.state.filter.pretreatmentStatus === '0' && total}</RadioButton>
          <RadioButton value="1">待复审{!loading && this.state.filter.pretreatmentStatus === '1' && total}</RadioButton>
          <RadioButton value="2">已审核{!loading && this.state.filter.pretreatmentStatus === '2' && total}</RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="赔案号"
          onSearch={value => this.fetch({ claimId: value, page: 0 })}
        />
      </div>
    );

    const handleEdit = (data) => {
      this.props.dispatch({
        type: 'caseList/update',
        payload: data,
        callback: () => {
          message.success('修改成功');
        },
      });
      this.setState({
        modalVisible: false,
      });
      this.fetch();
    };
    const handleAdd = () => {
      this.setState({
        currentItemRiskNumber: this.state.currentItemRiskNumber + 1,
      });
    };
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

    const ListContent =
      ({ data: {
        insuredPersonName,
        accidentDate,
        companyName,
        insuredPersonGender,
        receiveTime,
        claimPay,
        coverages,
        status,
        auditConclusion,
      },
      }) => {
        return (
          <div className={styles.listContent}>
            <div className={styles.modified} style={{ width: 230 }}>
              <p>{companyName.value}</p>
              <p>{moment(receiveTime).format('YYYY-MM-DD hh:mm')}</p>
              <p>{status}</p>
            </div>
            <div className={styles.flexContent}>
              <div className={styles.avatar}>
                <Avatar icon={icon(auditConclusion.value).icon} shape="square" size="large" style={icon(auditConclusion.value).style} />
              </div>
              <div className={styles.plainDiv}>
                <p>被保人:{insuredPersonName}</p>
                <p>性别:{insuredPersonGender && insuredPersonGender.value}</p>
                <p>出险日期:{moment(accidentDate).format('YYYY-MM-DD')}</p>
              </div>
              <div className={styles.plainDiv}>
                <p>结案金额:{claimPay}</p>
                <p>当前结论:{auditConclusion.value}</p>
              </div>
              <div className={styles.plainDiv}>
                <p>{coverages.map(item => item.value).join(',')}</p>
              </div>
            </div>
          </div>);
      };

    const menu = item => (
      <Menu onClick={(menuItem) => {
        switch (menuItem.key) {
          case '1':
            this.props.dispatch({
              type: 'caseList/publish',
              payload: { ...item },
              callback: () => {
                message.success('发布成功');
                this.fetch();
              },
            });
            break;
          case '2':
            this.props.dispatch({
              type: 'caseList/delete',
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
    // eslint-disable-next-line no-unused-vars
    const ListTitle = ({ riskDimension, description, suggestion, riskScore }) => {
      let temp = '';
      // if (riskDimension) temp = ` ┃ 维度:${riskDimension.split('||')[0]}`;
      if (suggestion) {
        temp = `${suggestion.split('||').map((item) => {
          return `${item}`;
        }).join('┃   ')}`;
      }
      // if (description) temp = `${temp} ┃ 说明:${description.split('||')[0]}`;

      return temp;
    };
    const icon = (value) => {
      if (value) {
        switch (value) {
          case '拒赔':
            return {
              icon: 'frown',
              style: { color: '#fd3244', backgroundColor: '#fdd439' },
            };
          case '部分':
            return {
              icon: 'meh',
              style: { color: '#f58d4e', backgroundColor: '#fde3cf' },
            };
          case '赔付':
            return {
              icon: 'smile',
              style: { color: '#95f53b', backgroundColor: '#e7fd83' },
            };
          default:
            return false;
        }
      } else {
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
                  {getFieldDecorator('companyId', {
                    initialValue: ['7428', '7427'],
                  })(
                    <TagSelect onChange={this.handleFormSubmit} expandable>
                      <TagSelect.Option value="7428">易安</TagSelect.Option>
                      <TagSelect.Option value="7427">江苏人保财</TagSelect.Option>
                    </TagSelect>
                  )}
                </FormItem>
              </StandardFormRow>
              <StandardFormRow title="录入方" block style={{ paddingBottom: 11 }}>
                <FormItem>
                  {getFieldDecorator('tpa')(
                    <TagSelect onChange={this.handleFormSubmit} expandable>
                      <TagSelect.Option value="shibo">世博</TagSelect.Option>
                      <TagSelect.Option value="pukang">普康</TagSelect.Option>
                    </TagSelect>
                  )}
                </FormItem>
              </StandardFormRow>
              {/* <StandardFormRow title="审核员" block style={{ paddingBottom: 11 }}> */}
              {/* <FormItem> */}
              {/* {getFieldDecorator('category')( */}
              {/* <TagSelect onChange={this.handleFormSubmit} expandable> */}
              {/* <TagSelect.Option value="未分配">未分配</TagSelect.Option> */}
              {/* <TagSelect.Option value="曾朝霞">曾朝霞</TagSelect.Option> */}
              {/* <TagSelect.Option value="罗咏梅">罗咏梅</TagSelect.Option> */}
              {/* <TagSelect.Option value="其他">其他</TagSelect.Option> */}
              {/* </TagSelect> */}
              {/* )} */}
              {/* </FormItem> */}
              {/* </StandardFormRow> */}
              <StandardFormRow
                title="其它选项"
                grid
                last
              >
                <Row gutter={16}>
                  <Col lg={8} md={10} sm={10} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label="排序方式"
                    >
                      {getFieldDecorator('sortBy', {
                        initialValue: 'claimId',
                      })(
                        <Select
                          onChange={this.handleFormSubmit}
                          placeholder="不限"
                          style={{ maxWidth: 200, width: '100%' }}
                        >
                          <Option value="createdAt">按照创建时间</Option>
                          <Option value="claimId">按照赔案号</Option>
                          <Option value="modifiedAt">按照修改时间</Option>
                          <Option value="riskDimension">按照风险维度</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={8} md={10} sm={10} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label="排序顺序"
                    >
                      {getFieldDecorator('asc', {
                        initialValue: false,
                      })(
                        <RadioGroup onChange={this.handleFormSubmit}>
                          <Radio value>升序</Radio>
                          <Radio value={false}>降序</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={8} md={10} sm={10} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label="案件筛选"
                    >
                      {getFieldDecorator('asc', {
                        initialValue: false,
                      })(
                        <RadioGroup onChange={this.handleFormSubmit}>
                          <Radio value>仅看个人</Radio>
                          <Radio value={false}>查看全部</Radio>
                        </RadioGroup>
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
            title="案件列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              itemLayout="vertical"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a onClick={() => {
                      this.setState(
                        {
                          currentItem: item,
                          currentItemRiskNumber: item.riskDimension ? item.riskDimension.split('||').length : 1,
                          modalVisible: true,
                        });
                  }}>
                      编辑
                    </a>,
                    <a onClick={() => {
                      window.open(
                        `/gw/am/attachment/getclaimFileByCalimId?claimId=${item.claimId}`
                      );
                    }}
                    >
                      影像
                    </a>,
                    <a onClick={() => {
                      this.props.dispatch({
                        type: 'caseList/publish',
                        payload: { ...item },
                        callback: () => {
                          message.success('发布成功');
                          this.fetch();
                        },
                      });
                    }}
                    >
                      审核通过
                    </a>,
                    <MoreBtn item={item} />]}
                >
                  <List.Item.Meta
                    title={
                      <a onClick={() => {
                        this.setState({ modalVisible: true, currentItem: item });
                      }}
                      >
                        {item.insuredPersonName} [{item.claimId}]
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
          riskNumber={this.state.currentItemRiskNumber}
          onOk={handleEdit}
          onAdd={handleAdd}
          onCancel={() => this.setState({ modalVisible: false })}
        />
      </PageHeaderLayout>
    );
  }
}
