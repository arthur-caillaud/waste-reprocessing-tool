import React from '../frontend/node_modules/react';
import { PropTypes } from '../frontend/node_modules/prop-types';

function stubRouterContext(Component) {

    return class extends React.Component {

        static childContextTypes = {
            router: PropTypes.object.isRequired,
        };

        // https://github.com/ReactTraining/react-router/blob/c5c40aab197e1f8d2de118fbad1e5ac9e18d1ea9/packages/react-router/modules/Router.js#L23
        getChildContext() {
            return {
                router: {
                    history: {
                        createHref: () => {},
                        push: () => {},
                        replace: () => {},
                    },
                    route: {
                        location: '/',
                        match: {
                            path: '/',
                            url: '/',
                            params: {},
                            isExact: true,
                        },
                    },
                },
            };
        }

        render() {
            return <Component ref={C => this.WrappedComponent = C} {...this.props} />;
        }
    };
}

export default stubRouterContext;
