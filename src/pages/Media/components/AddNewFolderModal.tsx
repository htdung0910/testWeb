import { Card, Input } from 'antd';
import React, { Component } from 'react';
import type { Dispatch, MediaSourceModelState, UserTestModelState } from 'umi';
import { connect } from 'umi';

export type AddNewFolderModalProps = {
  dispatch: Dispatch;
  userTest: UserTestModelState;
  media: MediaSourceModelState;
};

class AddNewFolderModal extends Component<AddNewFolderModalProps> {
  setAddNewFolderParam = async (params: any) => {
    await this.props.dispatch({
      type: 'media/setCreateFolderParamReducer',
      payload: {
        ...this.props.media.createFolderParam,
        ...params,
      },
    });
  };
  render() {
    const { createFolderParam } = this.props.media;
    return (
      <>
        <Card title={'Enter new folder name'}>
          <Input
            type="text"
            value={createFolderParam.name}
            onChange={async (e) => {
              this.setAddNewFolderParam({
                name: e.target.value,
              });
            }}
          />
        </Card>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(AddNewFolderModal);
