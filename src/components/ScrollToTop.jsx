import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

// Scroll back to top of the page & close bootstrap navbar on route change 
class ScrollToTop extends Component {

    componentDidUpdate(prevProps) {
        // after DOM has updated
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
            this.isNavBarOpen();
        }
    }

    isNavBarOpen() {
        $('.navbar-toggler').attr('aria-expanded') === 'true' ? $('.navbar-toggler').click() : null;
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(ScrollToTop); // withRouter here pushes the history object