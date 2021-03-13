import { Col, Divider, Input, Row } from 'antd';
import * as React from 'react';
import type { Dispatch, MediaSourceModelState, PlayListModelState, UserTestModelState } from 'umi';
import { connect } from 'umi';
import jwt_decode from 'jwt-decode';

type AddNewPlaylistModalProps = {
  dispatch: Dispatch;
  playlists: PlayListModelState;
  userTest: UserTestModelState;
  media: MediaSourceModelState;
};

class AddNewPlaylistModal extends React.Component<AddNewPlaylistModalProps> {
  state = {};
  componentDidMount() {
    const token = localStorage.getItem('JWT');
    if (token) {
      const user: any = jwt_decode(token);
      console.log('====================================');
      console.log(user);
      console.log('====================================');
      this.setAddNewPlaylistParam({
        accountId: user.Id,
      });
    }
  }
  setAddNewPlaylistParam = async (params: any) => {
    await this.props.dispatch({
      type: 'playlists/setAddNewPlaylistParamReducer',
      payload: {
        ...this.props.playlists.addNewPlaylistParam,
        ...params,
      },
    });
  };
  render() {
    const { addNewPlaylistParam } = this.props.playlists;
    return (
      <>
        <Row>
          <Col span={4}>Title</Col>
          <Col span={20}>
            <Input
              type="text"
              value={addNewPlaylistParam.title}
              onChange={(e) => {
                this.setAddNewPlaylistParam({
                  title: e.target.value,
                });
              }}
            ></Input>
          </Col>
        </Row>
        <Divider></Divider>
        <Row>
          <Col span={4}>Description:</Col>
          <Col span={20}>
            <Input
              type="text"
              value={addNewPlaylistParam.description}
              onChange={(e) => {
                this.setAddNewPlaylistParam({
                  description: e.target.value,
                });
              }}
            ></Input>
          </Col>
        </Row>
        <Divider></Divider>
        <Row>
          <Col span={4}></Col>
          <Col span={20}></Col>
        </Row>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(AddNewPlaylistModal);
