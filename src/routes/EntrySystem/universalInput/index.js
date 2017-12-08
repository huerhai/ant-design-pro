/* eslint-disable no-unused-vars,react/no-unused-state */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Radio, DatePicker, Cascader, InputNumber, Tabs, Icon, Button, Dropdown, Menu, message, Divider } from 'antd';
import FooterToolbar from '../../../components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import UniversalInput from '../../../components/UniversalInput';
import UniversalForm from '../../../components/UniversalForm';
import InvoiceTable from './InvoiceTable';
import InvoiceDetailTable from './InvoiceDetailTable';
import styles from './index.less';

import { basicInfo, basicEventInfo, invoiceInfo, claim as claimSchema, event as eventSchema, person as personSchema } from './claim';

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
      basicInfo,
      basicEventInfo,
      invoiceInfo,
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
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const children = [];
    Object.keys(data.properties)
      .forEach((key) => {
        const item = data.properties[key];
        children.push(
          <Col span={6} key={key}>
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
    return <Row gutter={8}>{children}</Row>;
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
          <Card className={styles.card} title="基本信息">
            {this.getInputForm(this.state.basicInfo)}
          </Card>
          <Card className={styles.card} title="事件信息">
            {this.getInputForm(this.state.basicEventInfo)}
            <Divider>收据信息</Divider>
            <Card className={styles.card} bordered={false} style={{ marginTop: 16 }}>
              {getFieldDecorator('invoiceList', {
                initialValue: [{
                  key: '0',
                  收据类型: '',
                  收据日期: '',
                  收据号: '',
                  费用总额: '0',
                  乙类自付: '0',
                  自费部分: '0',
                  统筹支付额: '0',
                  附加支付金额: '0',
                  大病支付: '0',
                  第三方支付: '0',
                  editable: true,
                  isNew: true,
                }],
              })(<InvoiceTable />)}
            </Card>
            <Divider>清单信息</Divider>
            <Card className={styles.card} bordered={false} style={{ marginTop: 16 }}>
              {getFieldDecorator('invoiceDetailList', {
                initialValue: [{
                  key: '0',
                  费用类型: '',
                  费用名称: '',
                  数量: '1',
                  单价: '0',
                  金额: '0',
                  自负比例: '0',
                  自负金额: '0',
                  editable: true,
                  isNew: true,
                }],
              })(<InvoiceDetailTable />)}
            </Card>
          </Card>
        </Form>
        <FooterToolbar>
          <Button
            onClick={() => {
              window.open('http://hic.leapstack.cn/gw/am/attachment/getclaimFileByCalimId?claimId=0000000180');
            }}
            loading={submitting}
          >
            增加事件
          </Button>
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
