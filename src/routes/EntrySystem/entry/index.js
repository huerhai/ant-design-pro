import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, Input, Select, Popover, Avatar } from 'antd';
import { connect } from 'dva';
import FooterToolbar from '../../../components/FooterToolbar/index';
import TableForm from './TableForm';
import PolicyTableForm from './PolicyTableForm';
import styles from './style.less';

const { Option } = Select;

const fieldLabels = {
  录入员: '录入员',
  序号: '序号',
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型',
  保单号: '保单号',
  赔付比例: '赔付比例',
  免赔额: '免赔额',
  有效保额: '有效保额',
  被保险人: '被保险人',
  身份证号码: '身份证号码',
  联系电话: '联系电话',
  领款人身份: '领款人身份',
  领款人姓名: '领款人姓名',
  领款人身份证号码: '领款人身份证号码',
  开户银行: '开户银行',
  开户支行: '开户支行',
  账号: '账号',
  其他扣除: '其他扣除',
  扣除原因: '扣除原因',
};

const tableData = [{
  费用总额: '0',
  乙类自付: '0',
  自费部分: '0',
  统筹支付额: '0',
  key: '1',
}];

@connect(state => ({
  user: state.user,
}))
class AdvancedForm extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: true,
    });
  }
  render() {
    const { form, dispatch, submitting, user } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError, getFieldValue } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    const girdWidth = {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 8,
      xl: 4,
    };
    const girdWidthBig = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 8,
    };
    const invoiceList = getFieldValue('invoiceList');
    const 扣除总计 = invoiceList ? invoiceList.reduce((a, b) => {
      return a + ((+b.乙类自付) + (+b.自费部分) + (+b.统筹支付额));
    }, 0) : 0;
    const 费用总计 = invoiceList ? invoiceList.reduce((a, b) => {
      return a + (+b.费用总额);
    }, 0) : 0;
    return (
      <div>
        <Card title="录入信息" className={styles.card} bordered={false}>
          <Form layout="inline" hideRequiredMark>
            <Row gutter={16}>
              <Col {...girdWidth} >
                <Form.Item label={fieldLabels.录入员}>
                  <Avatar size="small" className={styles.avatar} src={user.currentUser.avatar} />
                  {user.currentUser.name}
                </Form.Item>
              </Col>
              <Col {...girdWidth} >
                <Form.Item>
                  {getFieldDecorator('案件序号', {
                    rules: [{ required: true, message: '请输入案件编号' }],
                  })(
                    <Input placeholder="" addonBefore={fieldLabels.序号} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="保单信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col {...girdWidth} >
                <Form.Item>
                  {getFieldDecorator('保单号', {
                    initialValue: 'PEAC',
                    rules: [{ required: true, message: '请输入保单号' }],
                  })(
                    <Input addonBefore={fieldLabels.保单号} placeholder="请输入保单号" />
                  )}
                </Form.Item>
              </Col>
              <Col {...girdWidth} >
                <Form.Item>
                  {getFieldDecorator('赔付比例', {
                    initialValue: '100%',
                    rules: [{ required: true, message: '请输入赔付比例' }],
                  })(
                    <Input addonBefore={fieldLabels.赔付比例} addonAfter="%" />
                  )}
                </Form.Item>
              </Col>
              <Col {...girdWidth} >
                <Form.Item>
                  {getFieldDecorator('免赔额', {
                    initialValue: '100',
                    rules: [{ required: true, message: '请输入免赔额' }],
                  })(
                    <Input addonBefore={fieldLabels.免赔额} addonAfter="元" />
                  )}
                </Form.Item>
              </Col>
              <Col {...girdWidth} >
                <Form.Item>
                  {getFieldDecorator('有效保额', {
                    initialValue: '10000',
                    rules: [{ required: true, message: '请输入有效保额' }],
                  })(
                    <Input addonBefore={fieldLabels.有效保额} addonAfter="元" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {getFieldDecorator('policyList', {
            initialValue: tableData,
          })(<PolicyTableForm />)}
        </Card>
        <Card title="赔案信息" className={styles.card} bordered={false}>
          <Form layout="inline" hideRequiredMark>
            <Row gutter={16}>
              <Col {...girdWidth} >
                <Form.Item>
                  {getFieldDecorator('被保险人', {
                    initialValue: '',
                  })(
                    <Input addonBefore={fieldLabels.被保险人} />
                  )}
                </Form.Item>
              </Col>
              <Col {...girdWidth} >
                <Form.Item>
                  {getFieldDecorator('身份证号码', {
                    initialValue: '4309',
                  })(
                    <Input addonBefore={fieldLabels.身份证号码} />
                  )}
                </Form.Item>
              </Col>
              <Col {...girdWidth} >
                <Form.Item>
                  {getFieldDecorator('联系电话', {
                    initialValue: '',
                  })(
                    <Input addonBefore={fieldLabels.联系电话} />
                  )}
                </Form.Item>
              </Col>
              <Col {...girdWidth} >
                <Form.Item>
                  {getFieldDecorator('开户银行', {
                    initialValue: '',
                  })(
                    <Input addonBefore={fieldLabels.开户银行} />
                  )}
                </Form.Item>
              </Col>
              <Col {...girdWidth} >
                <Form.Item>
                  {getFieldDecorator('开户支行', {
                    initialValue: '',
                  })(
                    <Input addonBefore={fieldLabels.开户支行} />
                  )}
                </Form.Item>
              </Col>
              <Col {...girdWidth} >
                <Form.Item>
                  {getFieldDecorator('账号', {
                    initialValue: '',
                  })(
                    <Input addonBefore={fieldLabels.账号} />
                  )}
                </Form.Item>
              </Col>
              <Col {...girdWidth} >
                <Form.Item label="领款人身份">
                  {getFieldDecorator('领款人身份', {
                    initialValue: '本人',
                  })(
                    <Select style={{ width: 120 }} >
                      <Option value="本人">本人</Option>
                      <Option value="父亲">父亲</Option>
                      <Option value="母亲">母亲</Option>
                      <Option value="配偶">配偶</Option>
                      <Option value="子女">子女</Option>
                      <Option value="其他">其他</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              {getFieldValue('领款人身份') !== '本人' &&
                <Col {...girdWidth} >
                  <Form.Item>
                    {getFieldDecorator('领款人姓名', {
                      initialValue: '',
                    })(
                      <Input addonBefore={fieldLabels.领款人姓名} />
                    )}
                  </Form.Item>
                </Col>
              }
              {getFieldValue('领款人身份') !== '本人' &&
                <Col {...girdWidth} >
                  <Form.Item>
                    {getFieldDecorator('领款人身份证号码', {
                      initialValue: '',
                    })(
                      <Input addonBefore={fieldLabels.领款人身份证号码} />
                    )}
                  </Form.Item>
                </Col>
              }
            </Row>
          </Form>
        </Card>
        <Card title="收据信息" className={styles.card} bordered={false}>
          {getFieldDecorator('invoiceList', {
            initialValue: tableData,
          })(<TableForm />)}
          <Form layout="inline" hideRequiredMark>
            <Row gutter={16}>
              <Col {...girdWidthBig} >
                <Form.Item>
                  <Input addonBefore="收据费用总计" value={费用总计} disabled />
                </Form.Item>
              </Col>
              <Col {...girdWidthBig} >
                <Form.Item>
                  <Input addonBefore="收据扣除总计" value={扣除总计} disabled />
                </Form.Item>
              </Col>
              <Col {...girdWidthBig} >
                <Form.Item>
                  <Input addonBefore="收据核定总计" value={费用总计} disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Form layout="inline" hideRequiredMark>
            <Row gutter={16}>
              <Col {...girdWidthBig} >
                <Form.Item>
                  {getFieldDecorator('其他扣除', {
                    initialValue: '',
                  })(
                    <Input addonBefore={fieldLabels.其他扣除} />
                  )}
                </Form.Item>
              </Col>
              <Col {...girdWidthBig} >
                <Form.Item>
                  {getFieldDecorator('扣除原因', {
                    initialValue: '',
                  })(
                    <Input addonBefore={fieldLabels.扣除原因} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="理赔结论" className={styles.card} bordered={false}>
          <Form layout="inline" hideRequiredMark>
            <Row gutter={16}>
              <Col {...girdWidthBig} >
                <Form.Item>
                  <Input addonBefore="扣除金额" value={费用总计} disabled />
                </Form.Item>
              </Col>
              <Col {...girdWidthBig} >
                <Form.Item>
                  <Input addonBefore="收据扣除总计" value={扣除总计} disabled />
                </Form.Item>
              </Col>
              <Col {...girdWidthBig} >
                <Form.Item>
                  <Input addonBefore="收据核定总计" value={费用总计} disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <FooterToolbar>
          {getErrorInfo()}
          <Button onClick={validate} loading={submitting}>
            保存
          </Button>
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </div>
    );
  }
}

export default connect(state => ({
  collapsed: state.global.collapsed,
  submitting: state.form.advancedFormSubmitting,
}))(Form.create()(AdvancedForm));
