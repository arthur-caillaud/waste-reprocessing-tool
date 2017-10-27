import React from 'react';
import { Component } from 'react';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';

import 'react-dates/lib/css/_datepicker.css';

class CalendarElement extends Component {
    render() {
        const {
            startDate,
            endDate,
            focusedInput,
            onFocusChange,
        } = this.props;

        return(<DateRangePicker
            startDate={startDate} // momentPropTypes.momentObj or null,
            endDate={endDate} // momentPropTypes.momentObj or null,
            isOutsideRange={() => false}
            onDatesChange={({ startDate, endDate }) => console.log("vojzbr")} // PropTypes.func.isRequired,
            focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={onFocusChange}
        />)
    }
}
export default CalendarElement;
