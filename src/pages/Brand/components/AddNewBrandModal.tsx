import { Col, Divider, Input, Modal, Row } from 'antd';
import * as React from 'react';
import type { BrandModelState, Dispatch } from 'umi';
import { connect } from 'umi';

export type AddNewBrandModalProps = {
  dispatch: Dispatch;
  brand: BrandModelState;
};

class AddNewBrandModal extends React.Component<AddNewBrandModalProps> {
  setAddNewBrandModal = async (modal: any) => {
    await this.props.dispatch({
      type: 'brand/setAddNewBrandModalReducer',
      payload: {
        ...this.props.brand.addNewBrandModal,
        ...modal,
      },
    });
  };

  setCreateBrandParam = async (param: any) => {
    await this.props.dispatch({
      type: 'brand/setCreateBrandParamReducer',
      payload: {
        ...this.props.brand.createBrandParam,
        ...param,
      },
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

  createBrand = async () => {
    this.setAddNewBrandModal({
      isLoading: true,
    })
      .then(() => {
        this.props
          .dispatch({
            type: 'brand/createBrand',
            payload: this.props.brand.createBrandParam,
          })
          .then(() => {
            this.callGetListBrands().then(() => {
              this.setCreateBrandParam({
                name: '',
                description: '',
              }).then(() => {
                this.setAddNewBrandModal({
                  isLoading: false,
                  visible: false,
                });
              });
            });
          });
      })
      .catch(() => {
        this.setAddNewBrandModal({
          isLoading: false,
          visible: false,
        });
      });
  };
  render() {
    const { addNewBrandModal, createBrandParam } = this.props.brand;
    return (
      <>
        <Modal
          title="Add New Brand"
          destroyOnClose={true}
          visible={addNewBrandModal.visible}
          closable={false}
          confirmLoading={addNewBrandModal.isLoading}
          onOk={() => {
            this.createBrand();
          }}
          onCancel={() => {
            this.setAddNewBrandModal({
              visible: false,
            });
          }}
        >
          <Row>
            <Col span={10}>Name</Col>
            <Col span={14}>
              <Input
                value={createBrandParam.name}
                onChange={(e) => {
                  this.setCreateBrandParam({
                    name: e.target.value,
                  });
                }}
              />
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={10}>Description</Col>
            <Col span={14}>
              <Input
                value={createBrandParam.description}
                onChange={(e) => {
                  this.setCreateBrandParam({
                    description: e.target.value,
                  });
                }}
              />
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(AddNewBrandModal);
