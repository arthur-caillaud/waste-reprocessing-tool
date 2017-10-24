import React, { Component } from 'react';

import { longText } from '../utilities/text-generator.component';
import '../styles/general.css';

class MoreInfos extends Component {

    render() {

        const {
            defaultBody
        } = this.props;
        return (
            <div className="more-infos">
                    {defaultBody}
            </div>
        )
    }
}
export default MoreInfos;
