import { Button, Space } from 'antd';
import * as React from 'react';
import type { CampaignModelState, DeviceModelState, Dispatch } from 'umi';
import { connect } from 'umi';
import { CAMPAIGN } from '..';
import { v4 as uuidv4 } from 'uuid';

export type FilterDateComponentProps = {
  dispatch: Dispatch;
  campaign: CampaignModelState;
  deviceStore: DeviceModelState;
};

class FilterDateComponent extends React.Component<FilterDateComponentProps> {
  setCreateNewCampaignParam = async (param: any) => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/setCreateCampaignParamReducer`,
      payload: {
        ...this.props.campaign.createCampaignParam,
        ...param,
      },
    });
  };

  setDateFilter = async (index: number) => {
    const { createCampaignParam } = this.props.campaign;
    console.log('====================================');
    console.log('Old >>>', createCampaignParam.dateFilter);
    console.log('====================================');
    const newList = createCampaignParam.dateFilter.split('').map((date, i) => {
      if (index === i) {
        return date === '1' ? '0' : '1';
      }

      return date;
    });

    await this.setCreateNewCampaignParam({
      dateFilter: newList.toString().replaceAll(',', ''),
    });
  };

  render() {
    const { createCampaignParam } = this.props.campaign;
    return (
      <>
        <Space>
          {createCampaignParam.dateFilter.split('').map((date, index) => {
            return (
              <Button
                key={`${uuidv4()}`}
                onClick={() => {
                  this.setDateFilter(index);
                }}
                type={date === '1' ? 'primary' : 'default'}
              >
                {index === 0 && 'Monday'}
                {index === 1 && 'Tuesday'}
                {index === 2 && 'Wednesday'}
                {index === 3 && 'Thursday'}
                {index === 4 && 'Friday'}
                {index === 5 && 'Saturday'}
                {index === 6 && 'Sunday'}
              </Button>
            );
          })}
        </Space>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(FilterDateComponent);
