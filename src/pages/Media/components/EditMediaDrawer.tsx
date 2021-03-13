import { Col, Input, Row, Image, Divider, Skeleton } from 'antd';
import * as React from 'react';
import ReactPlayer from 'react-player';
import type { Dispatch, MediaSourceModelState } from 'umi';
import { connect } from 'umi';

type EditMediaDrawerProps = {
  dispatch: Dispatch;
  media: MediaSourceModelState;
};

class EditMediaDrawer extends React.Component<EditMediaDrawerProps> {
  setSelectedMedia = async (media: any) => {
    const { selectedFile } = this.props.media;
    await this.props.dispatch({
      type: 'media/setSelectedMediaSource',
      payload: {
        ...selectedFile,
        ...media,
      },
    });
  };
  setSelectedFile = async (param: any) => {
    const { selectedFile } = this.props.media;
    await this.props.dispatch({
      type: 'media/setSelectedFileReducer',
      payload: {
        ...selectedFile,
        ...param,
      },
    });
  };
  render() {
    const { selectedFile, editFileDrawer } = this.props.media;
    console.log('====================================');
    console.log('Select File >>>>>', selectedFile);
    console.log('====================================');
    return (
      <>
        <Skeleton active loading={editFileDrawer.isLoading}>
          <Row>
            <Col span={12}>Title</Col>
            <Col span={12}>
              <Input
                type={'text'}
                value={selectedFile.title}
                onChange={async (e) => {
                  await this.setSelectedFile({
                    title: e.target.value,
                  });
                }}
              ></Input>
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={12}>Description</Col>
            <Col span={12}>
              <Input
                type={'text'}
                value={selectedFile.description}
                onChange={async (e) => {
                  await this.setSelectedFile({
                    description: e.target.value,
                  });
                }}
              ></Input>
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={24}>
              {selectedFile.type.name === 'Image' && (
                <>
                  <Image src={selectedFile.urlPreview} width="100%"></Image>
                </>
              )}

              {selectedFile.type.name === 'Video' && (
                <>
                  <ReactPlayer
                    url={selectedFile.urlPreview}
                    playing={true}
                    controls={true}
                    width={'100%'}
                  />
                </>
              )}
            </Col>
          </Row>
        </Skeleton>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(EditMediaDrawer);
