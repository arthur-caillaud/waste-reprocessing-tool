import { connect } from "react-redux";
import * as actions from '../../actions';
import * as apiCalls from '../../actions/api_calls';
import CalendarElement from '../calendar.component';
import * as moment from 'moment';
function mapStateToProps(state) {

        if (typeof state.pageOptions.date.startDate === 'string') {
            return {
                date: {
                    startDate: moment(state.pageOptions.date.startDate),
                    endDate: moment(state.pageOptions.date.endDate)
            }
        }
    } else {
        return {
            date: state.pageOptions.date
        }
    }


}

function mapDispatchToProps(dispatch) {
    return {
        onDatesChange: (date) => {
            dispatch(actions.updateDate(date))
        },
        onClose: (date) => {
            dispatch(actions.updateDate(date))
            dispatch(apiCalls.updateSite(window.store.getState().updateSearchBar.site))
        }
    }
}


const Calendar = connect(mapStateToProps, mapDispatchToProps)(CalendarElement);
export default Calendar
