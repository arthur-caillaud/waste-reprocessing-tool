import React from 'react';
import { Component } from 'react';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';

import 'react-dates/lib/css/_datepicker.css';

class CalendarElement extends Component {
    constructor(props) {
        super(props);
        this.state= {}
    }
    render() {
        const {
            date,
            onDatesChange,
            onClose,

        } = this.props;
        

        return(<DateRangePicker
            startDate={date.startDate} // momentPropTypes.momentObj or null,
            endDate={date.endDate} // momentPropTypes.momentObj or null,
            isOutsideRange={() => false}
            minimumNights= {28}
            onClose= {onClose}
            displayFormat='DD-MM-YYYY'
            onDatesChange={onDatesChange} // PropTypes.func.isRequired,
            focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={focusedInput => {
                this.setState({ focusedInput })
            }}
        />)
    }
}
export default CalendarElement;
