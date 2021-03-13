import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  ExclamationCircleOutlined,
  PlusSquareTwoTone,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Button, Modal, Space, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import * as React from 'react';
import type { Brand, BrandModelState, Dispatch } from 'umi';
import { connect } from 'umi';
import AddNewBrandModal from './components/AddNewBrandModal';
import EditBrandModal from './components/EditBrandModal';

export type BrandProps = {
  dispatch: Dispatch;
  brand: BrandModelState;
};

class BrandScreen extends React.Component<BrandProps> {
  componentDidMount = async () => {
    this.clearGetListBrandsParam()
      .then(() => {
        this.setBrandsTableLoading(true).then(() => {
          this.callGetListBrands().then(() => {
            this.setBrandsTableLoading(false);
          });
        });
      })
      .catch(() => {
        this.setBrandsTableLoading(false);
      });
  };

  clearGetListBrandsParam = async () => {
    await this.props.dispatch({
      type: 'brand/clearGetListBrandsParamReducer',
    });
  };

  setBrandsTableLoading = async (isLoading: boolean) => {
    await this.props.dispatch({
      type: 'brand/setBrandsTableLoadingReducer',
      payload: isLoading,
    });
  };

  callGetListBrands = async (param?: any) => {
    await this.props.dispatch({
      type: 'brand/getListBrands',
      payload: {
        ...this.props.brand.getListBrandParam,
        ...param,
      },
    });
  };

  setSelectedBrand = async (item: Brand) => {
    await this.props.dispatch({
      type: 'brand/setSelectedBrandReducer',
      payload: {
        ...this.props.brand.selectedBrand,
        ...item,
      },
    });
  };

  setAddNewBrandModal = async (modal: any) => {
    await this.props.dispatch({
      type: 'brand/setAddNewBrandModalReducer',
      payload: {
        ...this.props.brand.addNewBrandModal,
        ...modal,
      },
    });
  };

  deleteConfirm = async (record: any) => {
    Modal.confirm({
      title: `Do you want to delete brand ${record.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: async () => {
        this.setBrandsTableLoading(true)
          .then(() => {
            this.props.dispatch({ type: 'brand/removeBrand', payload: record.id }).then(() => {
              this.callGetListBrands().then(() => {
                this.setBrandsTableLoading(false);
              });
            });
          })
          .catch(() => {
            this.setBrandsTableLoading(false);
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  setEditBrandModal = async (modal: any) => {
    await this.props.dispatch({
      type: 'brand/setEditBrandModalReducer',
      payload: {
        ...this.props.brand.editBrandModal,
        ...modal,
      },
    });
  };
  render() {
    const { listBrand, brandsTableLoading, getListBrandParam } = this.props.brand;
    return (
      <>
        <PageContainer>
          <Table
            loading={brandsTableLoading}
            dataSource={listBrand}
            pagination={{
              current: getListBrandParam.pageNumber + 1,
              onChange: async (e) => {
                this.setBrandsTableLoading(true)
                  .then(() => {
                    this.callGetListBrands({
                      pageNumber: e - 1,
                    }).then(() => {
                      this.setBrandsTableLoading(false);
                    });
                  })
                  .catch(() => {
                    this.setBrandsTableLoading(false);
                  });
              },
            }}
            title={() => {
              return (
                <>
                  <Button
                    icon={<PlusSquareTwoTone />}
                    onClick={() => {
                      this.setAddNewBrandModal({
                        visible: true,
                      });
                    }}
                  >
                    Add New Brand
                  </Button>
                </>
              );
            }}
            onRow={(row) => {
              return {
                onClick: async () => {
                  await this.setSelectedBrand(row);
                },
              };
            }}
          >
            <Column key="name" dataIndex="name" title="Name"></Column>
            <Column key="description" dataIndex="description" title="Description"></Column>
            <Column
              key="isApprove"
              title="Approve"
              render={(text, record: any) => {
                if (record.isApprove) {
                  return (
                    <>
                      <Alert
                        message={
                          <>
                            <Space>
                              <CheckCircleTwoTone />
                              Approved
                            </Space>
                          </>
                        }
                        type="success"
                      />
                    </>
                  );
                }

                return (
                  <>
                    <Alert
                      message={
                        <>
                          <Space align="center" style={{ textAlign: 'center' }}>
                            <ClockCircleTwoTone />
                            Waiting Approve
                          </Space>
                        </>
                      }
                      type="warning"
                    />
                  </>
                );
              }}
            ></Column>
            <Column
              key="action"
              title="Action"
              dataIndex=""
              render={(text, record: any) => {
                return (
                  <>
                    <Space>
                      <Button
                        onClick={() => {
                          this.setEditBrandModal({
                            visible: true,
                          });
                        }}
                      >
                        <EditTwoTone />
                      </Button>
                      <Button
                        onClick={() => {
                          this.deleteConfirm(record);
                        }}
                      >
                        <DeleteTwoTone twoToneColor="#f93e3e" />
                      </Button>
                    </Space>
                  </>
                );
              }}
            ></Column>
          </Table>
          <AddNewBrandModal {...this.props} />
          <EditBrandModal {...this.props} />
        </PageContainer>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(BrandScreen);
