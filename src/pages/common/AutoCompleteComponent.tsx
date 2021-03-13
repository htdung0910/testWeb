import * as React from 'react';
import type { Dispatch, LocationModelState } from 'umi';
import { connect } from 'umi';
import { LOCATION_DISPATCHER } from '../Location';
import AsyncSelect from 'react-select/async';
import { autoComplete } from '@/services/MapService/LocationIQService';

export type AutoCompleteComponentProps = {
  dispatch: Dispatch;
  location: LocationModelState;
  inputValue: string;
  onInputChange: (value: string) => void | Promise<void>;
  handleOnSelect: (value: string, address: string) => void | Promise<void>;
};

class AutoCompleteComponent extends React.Component<AutoCompleteComponentProps> {
  state = {
    isLoading: false,
    searchValue: '',
  };

  setAddNewLocationModal = async (modal: any) => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/setAddNewLocationModalReducer`,
      payload: {
        ...this.props.location.addNewLocationModal,
        ...modal,
      },
    });
  };

  promiseOptions = async (inputValue: any, callback: any): Promise<any> => {
    const { data } = await autoComplete(inputValue);

    callback(
      data.map((item: any) => {
        return {
          label: item.display_name,
          value: `${item.lat}-${item.lon}`,
        };
      }),
    );
  };

  render() {
    return (
      <AsyncSelect
        inputValue={this.props.inputValue}
        loadOptions={this.promiseOptions}
        // isClearable={true}
        blurInputOnSelect={true}
        escapeClearsValue={true}
        styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
        onChange={(e) => {
          if (e) {
            // this.props.onInputChange(e.label);
            this.props.handleOnSelect(e.value, e.label);
          }
        }}
        onInputChange={(e) => {
          this.props.onInputChange(e);
        }}
      />
    );
  }
}

export default connect((state) => ({ ...state }))(AutoCompleteComponent);
