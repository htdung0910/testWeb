import { PageContainer } from '@ant-design/pro-layout';
import * as React from 'react';
import { connect, UserTestModelState } from 'umi';

type ProfileProps = {
  userTest: UserTestModelState;
};

class Profile extends React.Component<ProfileProps> {
  render() {
    return <PageContainer></PageContainer>;
  }
}

export default connect((state) => ({ ...state }))(Profile);
