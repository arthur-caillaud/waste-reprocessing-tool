import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import CalendarElement from '../calendar.component';

function mapStateToProps(state) {
    return {
        focusedInput: state.pageOptions.focusedInput,
        startDate: state.pageOptions.startDate,
        endDate: state.pageOptions.endDate
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onFocusChange: () => {
            dispatch(actions.displayCalendar())
        }
    }
}

const Calendar = connect(mapStateToProps, mapDispatchToProps)(CalendarElement);
export default Calendar
