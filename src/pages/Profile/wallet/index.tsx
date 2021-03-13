import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Image, Space, Table, Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import * as React from 'react';
import type { DeviceModelState, Dispatch, ProfileWalletModelState, UserTestModelState } from 'umi';
import { connect } from 'umi';
import logo from '@/assets/wallet.svg';
import NumberFormat from 'react-number-format';
import Column from 'antd/lib/table/Column';
import { SendOutlined } from '@ant-design/icons';

type WalletProps = {
  dispatch: Dispatch;
  userTest: UserTestModelState;
  deviceStore: DeviceModelState;
  profileWallet: ProfileWalletModelState;
};

class Wallet extends React.Component<WalletProps> {
  state = {
    balance: 0,
    currentPage: 1,
    tableLoading: false,
  };

  componentDidMount = async () => {
    this.readJWT().then(() => {
      this.getBalance().then(() => {
        this.getListTransactions();
      });
    });
  };

  readJWT = async () => {
    await this.props.dispatch({
      type: 'userTest/readJWT',
      payload: '',
    });
  };
  getBalance = async () => {
    const { ether } = this.props.userTest.currentUser;
    console.log('====================================');
    console.log('Ether >>>', ether, ether?.contract);
    console.log('====================================');
    const balance = await ether?.getBalance();
    this.setState({ balance });
  };

  getListTransactions = async () => {
    const param = {
      holder: this.props.userTest.currentUser.ether?.wallet.address,
      token: this.props.userTest.currentUser.ether?.evn.SUPPORT_ADDRESS,
      limit: 10,
      page: this.state.currentPage,
    };
    await this.props.dispatch({
      type: 'profileWallet/setListTransactions',
      payload: param,
    });
  };

  render() {
    const { ether } = this.props.userTest.currentUser;
    const { listTransactions, totalTransaction, getTransactionsParam } = this.props.profileWallet;
    const { tableLoading, balance } = this.state;
    return (
      <PageContainer>
        <Card
          title={
            <>
              <Space>
                <Image width={50} src={logo} />
                <Title level={2}>{ether?.wallet.address}</Title>
              </Space>
            </>
          }
        >
          <Row>
            <Col span={4}>Balance</Col>
            <Col span={20}>
              <NumberFormat
                value={balance}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={4}>Transactions</Col>
            <Col span={20}>{totalTransaction}</Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={4}>Code</Col>
            <Col span={20}>0x</Col>
          </Row>
        </Card>
        <Table
          dataSource={listTransactions}
          scroll={{
            x: 1000,
            y: 1000,
          }}
          loading={tableLoading}
          pagination={{
            current: getTransactionsParam.page,
            showSizeChanger: false,
            pageSize: 10,
            total: totalTransaction,
            onChange: async (current) => {
              this.setState({
                currentPage: current,
                tableLoading: true,
              });
              await this.props.dispatch({
                type: 'profileWallet/setListTransactions',
                payload: {
                  ...getTransactionsParam,
                  page: current,
                },
              });
              this.setState({
                tableLoading: false,
              });
            },
          }}
        >
          <Column key="age" title="Age" dataIndex="age"></Column>
          <Column
            key="from"
            title="From"
            ellipsis={{ showTitle: true }}
            width={200}
            dataIndex="from"
          ></Column>
          <Column
            key="icon"
            width={50}
            render={() => {
              return (
                <>
                  <SendOutlined />
                </>
              );
            }}
          ></Column>
          <Column
            key="to"
            width={200}
            ellipsis={{ showTitle: true }}
            title="To"
            dataIndex="to"
          ></Column>
          <Column key="timestamp" title="Date" dataIndex="timestamp"></Column>
          <Column
            key="value"
            ellipsis={{ showTitle: true }}
            title="Value"
            dataIndex="value"
          ></Column>
        </Table>
      </PageContainer>
    );
  }
}

export default connect((state) => ({
  ...state,
}))(Wallet);
