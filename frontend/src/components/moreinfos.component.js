import React, { Component } from 'react';

import { longText } from '../utilities/text-generator.component';
import '../styles/general.css';

class MoreInfos extends Component {

    render() {

        const {
            title,
            defaultBody
        } = this.props;
        return (
            <div>
                <h3>
                    {title}
                </h3>
                <div>
                    {defaultBody}
                </div>


            </div>
        )
    }
}
export default MoreInfos;
