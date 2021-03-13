import { PageContainer } from '@ant-design/pro-layout';
// import firebase from '@/services/firebase';
import React from 'react';
import { Button, Drawer, Input, Select, Space, Table, Tooltip } from 'antd';
import type { DeviceModelState, Dispatch, UserTestModelState } from 'umi';
import { connect } from 'umi';
import Column from 'antd/lib/table/Column';
import { CloseSquareTwoTone, ControlTwoTone, EditOutlined, FilterTwoTone } from '@ant-design/icons';
import DrawerUpdateMultipleDevice from './components/DrawerUpdateMultipleDevice';

type DeviceProps = {
  dispatch: Dispatch;
  userTest: UserTestModelState;
  deviceStore: DeviceModelState;
};

class Device extends React.Component<DeviceProps> {
  /**
   *
   */
  state = {
    visible: false,
    confirmLoading: false,
    selectedRowKeys: [],
    selectedRow: {},
    isOpenDrawer: false,
    currentPage: 1,
    paginationConfig: {
      pageSize: 10,
      defaultCurrent: 1,
    },
    tableLoading: false,
  };

  async componentDidMount() {
    this.setState({
      tableLoading: true,
    });
    this.props
      .dispatch({
        type: 'deviceStore/getDevices',
      })
      .then(() => {
        this.setState({
          tableLoading: false,
        });
        this.props.dispatch({
          type: 'deviceStore/getDeviceType',
        });
      })
      .catch(() => {
        this.setState({
          tableLoading: false,
        });
      });
  }

  setEditModalVisible = (isOpen: boolean) => {
    this.props.dispatch({
      type: 'deviceStore/setEditMultipleDevicesDrawerVisible',
      payload: isOpen,
    });
  };

  setMultipleUpdateMode = async (isMultipleUpdate: boolean) => {
    await this.props.dispatch({
      type: 'deviceStore/setMultipleUpdateMode',
      payload: isMultipleUpdate,
    });
  };

  onUpdateDevice = async () => {
    await this.props.dispatch({
      type: 'deviceStore/updateDevice',
      payload: this.props.deviceStore.selectedDevice,
    });

    await this.props.dispatch({
      type: 'deviceStore/getDevices',
      payload: {
        ...this.props.deviceStore.getDevicesParam,
      },
    });
  };

  onUpdateMultipleDevices = async () => {
    await this.props.dispatch({
      type: 'deviceStore/updateListDevice',
      payload: {
        updateDevicesState: this.props.deviceStore.updateDevicesState,
        listId: this.props.deviceStore.selectedDevices.map((device) => {
          return device.id;
        }),
      },
    });

    await this.props.dispatch({
      type: 'deviceStore/clearUpdateDevicesDrawer',
    });
    this.setState({
      selectedRowKeys: [],
    });
    await this.props.dispatch({
      type: 'deviceStore/getDevices',
      payload: {
        ...this.props.deviceStore.getDevicesParam,
      },
    });
  };

  render() {
    const {
      selectedDevices,
      isUpdateMultiple,
      listDevices,
      selectedDevice,
      getDevicesParam,
    } = this.props.deviceStore;

    const { selectedRowKeys } = this.state;
    // console.log(selectedDevices);

    const rowSelection = {
      selectedRowKeys,
      onChange: async (selectedRowsKeys: React.Key[], selectedRows: any[]) => {
        this.setState({
          selectedRowKeys: selectedRowsKeys,
        });
        await this.props.dispatch({
          type: 'deviceStore/setSelectedDevices',
          payload: selectedRows,
        });
      },
    };

    return (
      <>
        <PageContainer>
          <div>Device List</div>
          <Table
            dataSource={listDevices}
            scroll={{ y: 'max-content' }}
            loading={this.state.tableLoading}
            title={() => {
              return (
                <>
                  <Space>
                    <Input.Search
                      placeholder="Input search text"
                      onSearch={(value) => {
                        this.props.dispatch({
                          type: 'deviceStore/getDevices',
                          payload: {
                            ...getDevicesParam,
                            name: value.trim(),
                          },
                        });
                      }}
                      enterButton
                    />
                    <ControlTwoTone style={{ fontSize: `2em` }} />
                    <Select
                      style={{ width: 120 }}
                      defaultValue="CreateTime"
                      onChange={async (value) => {
                        await this.props.dispatch({
                          type: 'deviceStore/getDevices',
                          payload:
                            value === 'CreateTime'
                              ? {
                                  ...getDevicesParam,
                                  isSort: true,
                                  isDescending: true,
                                  orderBy: value,
                                }
                              : {
                                  ...getDevicesParam,
                                  isSort: true,
                                  isDescending: false,
                                  orderBy: value,
                                },
                        });
                      }}
                    >
                      <Select.Option value="CreateTime">Newest</Select.Option>
                      <Select.Option value="Name">Name</Select.Option>
                    </Select>
                    <FilterTwoTone style={{ fontSize: `2em` }} />
                    {/* <Select
                      style={{ width: 120 }}
                      defaultValue="all"
                      onChange={async (value) => {
                        this.setState({
                          tableLoading: true,
                        });
                        if (value === 'all') {
                          this.props
                            .dispatch({
                              type: 'deviceStore/getDevices',
                              payload: {
                                ...getDevicesParam,
                                typeId: null,
                              },
                            })
                            .then(() => {
                              this.setState({
                                tableLoading: false,
                              });
                            })
                            .catch(() => {
                              this.setState({
                                tableLoading: false,
                              });
                            });
                        } else {
                          this.props
                            .dispatch({
                              type: 'deviceStore/getDevices',
                              payload: {
                                ...getDevicesParam,
                                typeId: value,
                              },
                            })
                            .then(() => {
                              this.setState({
                                tableLoading: false,
                              });
                            })
                            .catch(() => {
                              this.setState({
                                tableLoading: false,
                              });
                            });
                        }
                      }}
                    >
                      <Select.Option value={'all'}>All</Select.Option>
                      {listDeviceTypes.map((type) => {
                        return (
                          <Select.Option key={type.id} value={type.id}>
                            {type.typeName}
                          </Select.Option>
                        );
                      })}
                    </Select> */}
                    <Button
                      disabled={!(selectedDevices.length > 0)}
                      onClick={async () => {
                        this.setMultipleUpdateMode(true);

                        await this.props.dispatch({
                          type: 'deviceStore/setEditMultipleDevicesDrawerVisible',
                          payload: true,
                        });
                      }}
                    >
                      Edit Multiple Devices
                    </Button>
                  </Space>
                </>
              );
            }}
            onRow={(record) => {
              return {
                onClick: async () => {
                  this.setMultipleUpdateMode(false);

                  await this.props.dispatch({
                    type: 'deviceStore/setCurrentDevice',
                    payload: record,
                  });
                  this.setEditModalVisible(true);
                },
              };
            }}
            bordered
            rowSelection={rowSelection}
            pagination={{
              total: this.props.deviceStore.totalItem,
              pageSize: 10,
              current: this.state.currentPage,
              showSizeChanger: false,
              onChange: async (current) => {
                this.setState({
                  tableLoading: true,
                });
                this.props
                  .dispatch({
                    type: 'deviceStore/getDevices',
                    payload: {
                      ...getDevicesParam,
                      pageNumber: current,
                    },
                  })
                  .then(() => {
                    this.setState({
                      tableLoading: false,
                    });
                  })
                  .catch(() => {
                    this.setState({
                      tableLoading: false,
                    });
                  });
                this.setState({ currentPage: current });
              },
            }}
          >
            <Column key="Name" title="Name" dataIndex="name" width="100"></Column>
            <Column key="resolution" title="Resolution" dataIndex="resolution" width="100"></Column>
            <Column key="macAddress" title="MacAddress" dataIndex="macaddress" width="100"></Column>
            <Column
              key="description"
              title="Description"
              dataIndex="description"
              width="100"
              ellipsis={{ showTitle: true }}
              render={(description) => {
                return (
                  <>
                    <Tooltip placement="topLeft" title={description}>
                      {description}
                    </Tooltip>
                  </>
                );
              }}
            ></Column>
            {/* <Column key="type" title="Type" dataIndex="typeName" width="100"></Column> */}
            <Column
              key="createTime"
              title="Create Time"
              dataIndex="createTime"
              width="100"
            ></Column>
          </Table>
        </PageContainer>
        <Drawer
          title={isUpdateMultiple ? 'Update Multiple Devices' : selectedDevice.name}
          key="updateMultipleDevies"
          visible={this.props.deviceStore.editMultipleDevicesDrawerVisible}
          width={700}
          closable={false}
          onClose={() => {
            this.props.dispatch({
              type: 'deviceStore/setEditMultipleDevicesDrawerVisible',
              payload: false,
            });
          }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Space>
                <Button
                  icon={<CloseSquareTwoTone />}
                  onClick={async () => {
                    await this.props.dispatch({
                      type: 'deviceStore/setEditMultipleDevicesDrawerVisible',
                      payload: false,
                    });
                  }}
                >
                  Close Drawer
                </Button>
                <Button
                  icon={<CloseSquareTwoTone />}
                  onClick={async () => {
                    if (isUpdateMultiple) {
                      await this.onUpdateMultipleDevices();
                    } else {
                      await this.props.dispatch({
                        type: 'deviceStore/deleteDevice',
                        payload: selectedDevice.id,
                      });

                      this.props.dispatch({
                        type: 'deviceStore/getDevices',
                        payload: getDevicesParam,
                      });
                    }

                    await this.props.dispatch({
                      type: 'deviceStore/setEditMultipleDevicesDrawerVisible',
                      payload: false,
                    });
                  }}
                >
                  {isUpdateMultiple ? 'Delete Multiple Devices' : 'Delete Device'}
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={async () => {
                    this.setState({
                      tableLoading: true,
                    });
                    if (isUpdateMultiple) {
                      this.onUpdateMultipleDevices()
                        .then(() => {
                          this.setState({
                            tableLoading: false,
                          });
                        })
                        .catch(() => {
                          this.setState({
                            tableLoading: false,
                          });
                        });
                    } else {
                      await this.onUpdateDevice()
                        .then(() => {
                          this.setState({
                            tableLoading: false,
                          });
                        })
                        .catch(() => {
                          this.setState({
                            tableLoading: false,
                          });
                        });
                    }

                    this.props.dispatch({
                      type: 'deviceStore/setEditMultipleDevicesDrawerVisible',
                      payload: false,
                    });
                  }}
                >
                  {isUpdateMultiple ? 'Update Multiple Devices' : 'Update Device'}
                </Button>
              </Space>
            </div>
          }
        >
          <DrawerUpdateMultipleDevice {...this.props}></DrawerUpdateMultipleDevice>
        </Drawer>
      </>
    );
  }
}

export default connect((state) => ({
  ...state,
}))(Device);
