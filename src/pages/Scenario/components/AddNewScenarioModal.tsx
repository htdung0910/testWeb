import { Card, Col, Divider, Input, List, Row } from 'antd';
import * as React from 'react';
import type { Dispatch, LayoutModelState, ScenarioModelState, UserTestModelState } from 'umi';
import { connect } from 'umi';
import styles from '../index.less';

export type AddNewScenarioModalProps = {
  dispatch: Dispatch;
  userTest: UserTestModelState;
  scenarios: ScenarioModelState;
  layouts: LayoutModelState;
};

class AddNewScenarioModal extends React.Component<AddNewScenarioModalProps> {
  chooseLayout = async (layout: any) => {
    this.setCreateScenarioParam({
      layoutId: layout.id,
    });
    await this.props.dispatch({
      type: 'layouts/setListLayoutsReducer',
      payload: this.props.layouts.listLayouts.map((item) => {
        if (item.id === layout.id) {
          return {
            ...item,
            isSelected: true,
          };
        }

        return {
          ...item,
          isSelected: false,
        };
      }),
    });
  };

  setCreateScenarioParam = (param: any) => {
    this.props.dispatch({
      type: 'scenarios/setCreateScenarioParamReducer',
      payload: {
        ...this.props.scenarios.createScenarioParam,
        ...param,
      },
    });
  };
  render() {
    const { listLayouts } = this.props.layouts;

    const { createScenarioParam } = this.props.scenarios;

    return (
      <>
        <Row>
          <Col span={10}>Title</Col>
          <Col span={14}>
            <Input
              value={createScenarioParam.title}
              onChange={(e) => {
                this.setCreateScenarioParam({
                  title: e.target.value,
                });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={10}>Description</Col>
          <Col span={14}>
            <Input
              value={createScenarioParam.description}
              onChange={(e) => {
                this.setCreateScenarioParam({
                  description: e.target.value,
                });
              }}
            />
          </Col>
        </Row>
        <Divider></Divider>
        <List
          dataSource={listLayouts}
          grid={{
            gutter: 16,
            column: 4,
          }}
          renderItem={(item) => {
            return (
              <List.Item>
                <Card
                  title={item.title}
                  className={item.isSelected ? styles.selectedLayout : ''}
                  onClick={() => {
                    this.chooseLayout(item);
                  }}
                ></Card>
              </List.Item>
            );
          }}
        ></List>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(AddNewScenarioModal);
