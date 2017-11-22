/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Radio, DatePicker, Cascader, InputNumber, Tabs, Icon, Button, Dropdown, Menu, message } from 'antd';
import FooterToolbar from '../../../components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import UniversalInput from '../../../components/UniversalInput';
import UniversalForm from '../../../components/UniversalForm';
import InvoiceTable from './InvoiceTable';
import styles from './index.less';

import { claim as claimSchema, event as eventSchema, person as personSchema } from './claim';

const { TabPane } = Tabs;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  group: state.group,
}))
@Form.create()
export default class UniversalClaim extends PureComponent {
  constructor(props) {
    super(props);
    this.newTabIndex = 1;
    this.state = {
      activeKey: '1 事件',
      events: [],
      personActiveKey: '被保人 申请人 报案人 领款人',
      persons: [{
        key: '被保人 申请人 报案人 领款人',
        title: '被保人 申请人 报案人 领款人',
      }],
      claimSchema,
      eventSchema,
      personSchema,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/fetch',
    });
  }
  onChange = (activeKey) => {
    this.setState({ activeKey });
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }
  onPeasonEdit = (targetKey, action) => {
    if (action === 'remove') this.removePeason(targetKey);
  }
  getInputForm(data) {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const children = [];
    Object.keys(data.properties)
      .sort((a, b) => data.properties[a].order - data.properties[b].order)
      .forEach((key) => {
        const item = data.properties[key];
        children.push(
          <Col span={8} key={key}>
            <FormItem {...formItemLayout} label={item.title}>
              {getFieldDecorator(key, {
                initialValue: item.defaultValue,
                rules: item.rules,
              })(
                <UniversalInput schema={item} />
              )}
            </FormItem>
          </Col>
        );
      });
    return <Row gutter={40}>{children}</Row>;
  }
  add = (name) => {
    const { events } = this.state;
    const activeKey = `${this.newTabIndex}-${name}事件`;
    events.push({ title: activeKey, key: activeKey, type: name });
    this.setState({ events, activeKey });
    this.newTabIndex = this.newTabIndex + 1;
  }
  addPerson = (name) => {
    const { persons } = this.state;
    const personActiveKey = `${name}`;
    persons[0].key = persons[0].key.replace(` ${name}`, '');
    persons[0].title = persons[0].key.replace(` ${name}`, '');
    persons.push({ title: personActiveKey, key: personActiveKey });
    this.setState({ persons, personActiveKey });
  }
  remove = (targetKey) => {
    let { activeKey } = this.state;
    let lastIndex = 0;
    this.state.events.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const events = this.state.events.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = events[lastIndex].key;
    }
    this.setState({ events, activeKey });
  }
  removePeason = (targetKey) => {
    let { personActiveKey } = this.state;
    let lastIndex;
    this.state.persons.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const persons = this.state.persons.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && personActiveKey === targetKey) {
      personActiveKey = persons[lastIndex].key;
    }
    this.setState({ persons, personActiveKey });
  }
  handleFormChange = (index, changedFields) => {
    const newEvents = this.state.events.map((item, index2) => {
      if (index2 === index) {
        return { ...item, ...changedFields };
      }
      return item;
    });
    this.setState({
      events: newEvents,
    });
  }
  render() {
    const { form, submitting = false } = this.props;
    const { persons } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        // if (error) {
        // } else {
        //   // console.log(this.state.events);
        // }
      });
    };
    return (
      <PageHeaderLayout title="数据录入">
        <Form>
          <Card className={styles.card} bordered={false}>
            {this.getInputForm(this.state.claimSchema)}
          </Card>
          <Card className={styles.card} bordered={false} style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <span>添加:</span>
              {~persons[0].title.indexOf('申请人') ? <Button onClick={this.addPerson.bind(this, '申请人')}>+申请人</Button> : null}
              {~persons[0].title.indexOf('领款人') ? <Button onClick={this.addPerson.bind(this, '领款人')}>+领款人</Button> : null}
              {~persons[0].title.indexOf('报案人') ? <Button onClick={this.addPerson.bind(this, '报案人')}>+报案人</Button> : null}
            </div>
            <Tabs
              hideAdd
              onChange={key => this.setState({ personActiveKey: key })}
              activeKey={this.state.personActiveKey}
              type="editable-card"
              onEdit={this.onPeasonEdit}
            >
              {this.state.persons.map((pane, index) => {
                return (
                  <TabPane tab={pane.title} key={pane.key}>
                    <Card className={styles.card} bordered={false}>
                      <UniversalForm
                        schema={this.state.personSchema}
                        {...this.state.persons[index]}
                        onChange={this.handleFormChange.bind(this, index)}
                      />
                    </Card>
                  </TabPane>);
              })}
            </Tabs>
          </Card>
          <Card className={styles.card} bordered={false} style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <span>添加:</span>
              <Button onClick={this.add.bind(this, '疾病门诊')}>+疾病门诊事件</Button>
              <Button onClick={this.add.bind(this, '疾病住院')}>+疾病住院事件</Button>
              <Button onClick={this.add.bind(this, '意外门诊')}>+意外门诊事件</Button>
              <Button onClick={this.add.bind(this, '意外住院')}>+意外住院事件</Button>
              <Button onClick={this.add.bind(this, '伤残')}>+伤残事件</Button>
              <Button onClick={this.add.bind(this, '生育')}>+生育事件</Button>
              <Button onClick={this.add.bind(this, '身故')}>+身故事件</Button>
            </div>
            <Tabs
              hideAdd
              onChange={this.onChange}
              activeKey={this.state.activeKey}
              type="editable-card"
              onEdit={this.onEdit}
            >
              {this.state.events.map((pane, index) => {
                return (
                  <TabPane tab={pane.title} key={pane.key}>
                    <Card className={styles.card} bordered={false}>
                      <UniversalForm
                        filter={this.state.events[index].type}
                        schema={this.state.eventSchema}
                        {...this.state.events[index]}
                        onChange={this.handleFormChange.bind(this, index)}
                      />
                    </Card>
                  </TabPane>);
              })}
            </Tabs>
          </Card>
          <Card className={styles.card} bordered={false} style={{ marginTop: 16 }}>
            {getFieldDecorator('invoiceList', {
              initialValue: [],
            })(<InvoiceTable />)}
          </Card>
        </Form>
        <FooterToolbar>
          <Button
            onClick={() => {
              window.open('http://hic.leapstack.cn/gw/am/attachment/getclaimFileByCalimId?claimId=0000000180');
            }}
            loading={submitting}
          >
            查看影像件
          </Button>
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
