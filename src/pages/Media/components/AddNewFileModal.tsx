import * as React from 'react';
import type { UserTestModelState } from 'umi';
import { connect } from 'umi';
import type { MediaSourceModelState } from 'umi';
import type { Dispatch } from 'umi';
import { Col, Input, Row, Upload, Skeleton, Select, Divider, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

type AddNewModalMediaProps = {
  dispatch: Dispatch;
  media: MediaSourceModelState;
  userTest: UserTestModelState;
};

class AddNewMediaModal extends React.Component<AddNewModalMediaProps> {
  state = {};

  componentDidMount = async () => {
    const { listMediaType } = this.props.media;

    await this.setAddNewFileModal({
      isLoading: true,
    });

    this.setCreateFileParam({
      typeId: listMediaType[0].id,
      typeName: listMediaType[0].name,
    })
      .then(() => {
        this.props
          .dispatch({
            type: 'userTest/readJWT',
            payload: '',
          })
          .then(() => {
            this.setAddNewFileModal({
              isLoading: false,
            });
          });
      })
      .catch(() => {
        this.setAddNewFileModal({
          isLoading: false,
        });
      });
  };

  setCreateFileParam = async (modal: any) => {
    await this.props.dispatch({
      type: 'media/setCreateFileParamReducer',
      payload: {
        ...this.props.media.createFileParam,
        ...modal,
      },
    });
  };

  setAddNewFileModal = async (modal: any) => {
    this.props.dispatch({
      type: 'media/setAddNewFileModalReducer',
      payload: {
        ...this.props.media.addNewFileModal,
        ...modal,
      },
    });
  };

  render() {
    const { createFileParam, addNewFileModal, breadScrumb, listMediaType } = this.props.media;
    return (
      <>
        <Skeleton active loading={addNewFileModal.isLoading}>
          <Row>
            <Col flex={2}>Upload</Col>
            <Col flex={5}>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                fileList={addNewFileModal.fileList}
                showUploadList={true}
                onChange={async (file) => {
                  // const hash = new Keccak(256);
                  // const byte = await file.file.originFileObj?.arrayBuffer();
                  // hash.update(Buffer.from(byte));
                  // const security = hash.digest('hex');
                  this.setCreateFileParam({
                    ...createFileParam,
                    file: file.file.originFileObj,
                    folder: breadScrumb[breadScrumb.length - 1].id,
                  }).then(() => {
                    this.setAddNewFileModal({
                      fileList: file.fileList,
                    });
                  });
                }}
              >
                {addNewFileModal.fileList.length >= 1 ? null : <UploadOutlined />}
              </Upload>
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={8}>Title</Col>
            <Col span={16}>
              <Input
                type="text"
                value={createFileParam.title}
                onChange={(e) => {
                  this.setCreateFileParam({
                    title: e.target.value,
                  });
                }}
              ></Input>
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={8}>Description</Col>
            <Col span={16}>
              <Input
                type="text"
                value={createFileParam.description}
                onChange={(e) => {
                  this.setCreateFileParam({
                    description: e.target.value,
                  });
                }}
              ></Input>
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={8}>Sign Media</Col>
            <Col span={16}>
              <Switch
                defaultChecked={false}
                onChange={(e) => {
                  this.setCreateFileParam({
                    isSigned: e ? 1 : 0,
                  });
                }}
              />
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={8}>Type</Col>
            <Col span={16}>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a type"
                defaultValue={listMediaType[0].name}
                optionFilterProp="children"
                onChange={(value) => {
                  const type = listMediaType.filter((t) => t.id === value)[0];
                  if (createFileParam) {
                    this.setCreateFileParam({
                      typeId: type.id,
                      typeName: type.name,
                    });
                  }
                }}
                value={createFileParam.typeName}
              >
                {listMediaType.map((type) => {
                  return (
                    <Select.Option key={type.id} value={type.id}>
                      {type.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Col>
          </Row>
        </Skeleton>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(AddNewMediaModal);
