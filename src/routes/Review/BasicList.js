/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Select, List, Card, Row, Col, Radio, Input, Icon, Dropdown, Menu, Avatar, message } from 'antd';

import { caseState } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardFormRow from '../../components/StandardFormRow';

import EditModal from './modle';
import styles from './BasicList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

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
      page: this.props.caseList.page || 0,
      size: 40,
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
            ...form.getFieldsValue(),
            ...newFilter,
          };
          if (filter) {
            filter = {
              ...filter,
            };
            if (filter.auditConclusion) {
              filter = {
                ...filter,
                auditConclusion: {
                  referenceCode: filter.auditConclusion,
                  type: 12,
                },
              };
            }
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
  exportCase = (item) => {
    window.open(`gw/cs/excelexport/excel?fileName=${new Date().toLocaleDateString()}.xls&companyId=${item.companyName.dictionaryDataId}&claimIds=${item.claimId}&afterUpdateStatus=40`);
  }
  render() {
    const { caseList: { list, loading, total, currentItem }, dispatch } = this.props;
    const { modalVisible } = this.state;
    const extraContent = (
      <div className={styles.extraContent}>
        <a
          onClick={() => {
            this.fetch();
          }}
          style={{ marginRight: 15 }}
        >
          刷新
        </a>
        <RadioGroup
          defaultValue={undefined}
          onChange={(e) => {
            this.fetch({ statusCodes: e.target.value ? e.target.value.split(',').map(item => +item) : undefined, page: 0 });
          }}
        >
          <RadioButton value={undefined}>
            全部{!loading && this.state.filter.statusCodes === undefined && total}
          </RadioButton>
          <RadioButton value="10,11" >质检{!loading && this.state.filter.statusCodes && ~this.state.filter.statusCodes.indexOf(10) ? total : ''}</RadioButton>
          <RadioButton value="91" >质检不通过{!loading && this.state.filter.statusCodes && ~this.state.filter.statusCodes.indexOf(91) ? total : ''}</RadioButton>
          <RadioButton value="20,21,92" >待审核{!loading && this.state.filter.statusCodes && ~this.state.filter.statusCodes.indexOf(20) ? total : ''}</RadioButton>
          <RadioButton value="92" >审核未通过{!loading && this.state.filter.statusCodes && ~this.state.filter.statusCodes.indexOf(92) ? total : ''}</RadioButton>
          <RadioButton value="30" >审核通过{!loading && this.state.filter.statusCodes && ~this.state.filter.statusCodes.indexOf(30) ? total : ''}</RadioButton>
          <RadioButton value="40" >已导出{!loading && this.state.filter.statusCodes && ~this.state.filter.statusCodes.indexOf(40) ? total : ''}</RadioButton>
        </RadioGroup>
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
        companyName = { value: '未知公司' },
        insuredPersonGender,
        receiveTime,
        claimPay,
        coverages,
        status,
        riskLevel,
        auditConclusion,
      },
      }) => {
        const result = auditConclusion || { value: '没有结论' };
        return (
          <div className={styles.listContent}>
            <div className={styles.modified} style={{ width: 230 }}>
              <p>{companyName.value}</p>
              <p>{moment(receiveTime).format('YYYY-MM-DD hh:mm')}</p>
              <p>{caseState(status).label}</p>
            </div>
            <div className={styles.flexContent}>
              <div className={styles.avatar}>
                <Avatar icon={icon(result.value).icon} shape="square" size="large" style={icon(result.value).style} />
              </div>
              <div className={styles.plainDiv}>
                <p>被保人:{insuredPersonName}</p>
                <p>性别:{insuredPersonGender && insuredPersonGender.value}</p>
                <p>出险日期:{moment(accidentDate).format('YYYY-MM-DD')}</p>
              </div>
              <div className={styles.plainDiv}>
                <p>结案金额:{claimPay}</p>
                <p>当前结论:{result.value}</p>
                <p>风险总结:{riskLevel}</p>

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
              icon: 'dislike',
              style: { color: '#fd3244', backgroundColor: '#fdd439' },
            };
          case '部分':
            return {
              icon: 'like',
              style: { color: '#f58d4e', backgroundColor: '#fde3cf' },
            };
          case '赔付':
            return {
              icon: 'like',
              style: { color: '#95f53b', backgroundColor: '#e7fd83' },
            };
          default:
            return {
              icon: 'question-circle',
              style: { color: '#eeeeee', backgroundColor: '#d8d8d8' },
            };
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
                    initialValue: undefined,
                  })(
                    <RadioGroup onChange={this.handleFormSubmit}>
                      <Radio value={undefined}>不限</Radio>
                      <Radio value="7428">易安</Radio>
                      <Radio value="7427">江苏人保财</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </StandardFormRow>
              <StandardFormRow
                title="案件筛选"
                block
                style={{ paddingBottom: 11 }}
              >
                <Row gutter={16}>
                  <Col lg={8} md={10} sm={10} xs={24}>
                    <FormItem>
                      {getFieldDecorator('auditConclusion')(
                        <RadioGroup onChange={this.handleFormSubmit}>
                          <Radio value={undefined}>不限</Radio>
                          <Radio value="1" >赔付</Radio>
                          <Radio value="3" >部分赔付</Radio>
                          <Radio value="4" >拒赔</Radio>
                          <Radio value="6" >撤案</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={8} md={10} sm={10} xs={24}>
                    <FormItem>
                      {getFieldDecorator('riskLevel')(
                        <RadioGroup onChange={this.handleFormSubmit}>
                          <Radio value={undefined}>不限</Radio>
                          <Radio value="低">低风险</Radio>
                          <Radio value="中">中风险</Radio>
                          <Radio value="高">高风险</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                </Row>
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
                  <Col lg={8} md={12} sm={10} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label="赔案号"
                    >
                      {getFieldDecorator('claimId', {
                        initialValue: '',
                      })(
                        <Search
                          className={styles.extraContentSearch}
                          placeholder="赔案号"
                          onSearch={this.handleFormSubmit}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={8} md={12} sm={10} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label="姓名"
                    >
                      {getFieldDecorator('insuredPersonName', {
                        initialValue: '',
                      })(
                        <Search
                          className={styles.extraContentSearch}
                          placeholder="被保人姓名"
                          onSearch={this.handleFormSubmit}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={8} md={12} sm={10} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label="身份证"
                    >
                      {getFieldDecorator('insuredPersonId', {
                        initialValue: '',
                      })(
                        <Search
                          className={styles.extraContentSearch}
                          placeholder="被保人身份证"
                          onSearch={this.handleFormSubmit}
                        />
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
                    ...caseState(item.status).toDo.map((todo) => {
                      return (
                        <a
                          key={todo.label}
                          className={styles[`action-${todo.css}`]}
                          onClick={() => {
                            dispatch(
                              {
                                type: 'caseList/changeStatus',
                                payload: {
                                  items: [item.claimDataId],
                                  to: todo.to,
                                },
                              }
                            );
                            if (todo.fn) {
                             this[todo.fn](item);
                            }
                          }}
                        >{todo.label}
                        </a>);
                    }),
                    <a onClick={() => {
                      dispatch({
                        type: 'caseList/fetchDutyDetail',
                        payload: item,
                        callback: () => {
                          this.setState(
                            {
                              currentItem: this.props.caseList.currentItem,
                              modalVisible: true,
                            });
                        },
                      });
                    }}
                    >
                      编辑责任
                    </a>,
                    <a onClick={() => {
                      this.setState(
                        {
                          currentItem: item,
                          currentItemRiskNumber: item.riskDimension ? item.riskDimension.split('||').length : 1,
                          modalVisible: true,
                        });
                    }}
                    >
                      查看
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
          title="编辑责任"
          visible={modalVisible}
          item={this.state.currentItem}
          onOk={() => {
            this.state.currentItem.dutyList.forEach((duty) => {
              dispatch({
                type: 'caseList/updateDutyByClaimId',
                payload: duty,
              });
            });
            this.setState({ modalVisible: false });
          }}
          onAdd={handleAdd}
          onChange={(item) => {
            this.setState({
              currentItem: item,
            });
          }}
          onCancel={() => this.setState({ modalVisible: false })}
        />
      </PageHeaderLayout>
    );
  }
}
