import type { UpdateBrandParam } from '@/services/BrandService/BrandServices';
import { Col, Input, Modal, Row } from 'antd';
import * as React from 'react';
import type { BrandModelState, Dispatch } from 'umi';
import { connect } from 'umi';

export type EditBrandModalProps = {
  dispatch: Dispatch;
  brand: BrandModelState;
};

class EditBrandModal extends React.Component<EditBrandModalProps> {
  setSelectedBrand = async (item: any) => {
    await this.props.dispatch({
      type: 'brand/setSelectedBrandReducer',
      payload: {
        ...this.props.brand.selectedBrand,
        ...item,
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

  callGetListBrands = async (param?: any) => {
    await this.props.dispatch({
      type: 'brand/getListBrands',
      payload: {
        ...this.props.brand.getListBrandParam,
        ...param,
      },
    });
  };

  updateBrand = async () => {
    const { selectedBrand } = this.props.brand;
    const updateParam: UpdateBrandParam = {
      id: selectedBrand.id,
      description: selectedBrand.description,
      name: selectedBrand.name,
    };
    this.setEditBrandModal({
      isLoading: true,
    })
      .then(() => {
        this.props
          .dispatch({
            type: 'brand/updateBrand',
            payload: updateParam,
          })
          .then(() => {
            this.callGetListBrands().then(() => {
              this.setEditBrandModal({
                isLoading: false,
                visible: false,
              });
            });
          });
      })
      .catch(() => {
        this.setEditBrandModal({
          isLoading: false,
          visible: false,
        });
      });
  };
  render() {
    const { editBrandModal, selectedBrand } = this.props.brand;
    return (
      <>
        <Modal
          title="Update Brand"
          closable={false}
          destroyOnClose={true}
          confirmLoading={editBrandModal.isLoading}
          visible={editBrandModal.visible}
          onCancel={() => {
            this.setEditBrandModal({
              visible: false,
            });
          }}
          onOk={() => {
            this.updateBrand();
          }}
        >
          <Row>
            <Col span={10}>Name</Col>
            <Col span={14}>
              <Input
                value={selectedBrand.name}
                onChange={(e) => {
                  this.setSelectedBrand({
                    name: e.target.value,
                  });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={10}>Description</Col>
            <Col span={14}>
              <Input
                value={selectedBrand.description}
                onChange={(e) => {
                  this.setSelectedBrand({
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

export default connect((state) => ({ ...state }))(EditBrandModal);
