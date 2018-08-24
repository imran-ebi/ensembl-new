import React, { Component, Fragment, ReactNode } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { UnregisterCallback, Location } from 'history';

import BrowserBar from './BrowserBar';
import TrackPanel from '../../layout/track-panel/TrackPanel';
import Track from '../../tracks/Track';

type BrowserParams = {};

type BrowserProps = RouteComponentProps<BrowserParams> & {
  trackRoutes: ReactNode
};

type BrowserState = {
  browserExpanded: boolean,
  drawerOpened: boolean,
  currentTrack: string
};

class Browser extends Component<BrowserProps, BrowserState> {
  historyUnlistener: UnregisterCallback = () => null;

  constructor(props: BrowserProps) {
    super(props);

    this.state = {
      browserExpanded: false,
      drawerOpened: false,
      currentTrack: ''
    };

    this.toggleBrowser = this.toggleBrowser.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.updateCurrentTrackName = this.updateCurrentTrackName.bind(this);
  }

  componentDidMount() {
    this.toggleDrawer(this.props.location);

    this.historyUnlistener = this.props.history.listen((location: Location) => {
      this.toggleDrawer(location);
    });
  }

  componentWillUnmount() {
    this.historyUnlistener();
  }

  toggleBrowser() {
    const browserExpanded = !this.state.browserExpanded;

    this.setState({ browserExpanded });
  }

  toggleDrawer(location: Location) {
    let drawerOpened: boolean = true;

    if (location.pathname === this.props.match.path) {
      drawerOpened = false;
    }

    this.setState({ drawerOpened });
  }

  closeDrawer() {
    if (this.state.drawerOpened === false) {
      return;
    }

    const { history, match } = this.props;

    history.push(`${match.path}`);
  }

  updateCurrentTrackName(currentTrack: string) {
    this.setState({ currentTrack });
  }

  render() {
    const { browserExpanded, drawerOpened } = this.state;

    let className: string = 'browser ';

    if (drawerOpened === true) {
      className += 'collapsed';
    } else if (browserExpanded === true) {
      className += 'expanded';
    } else {
      className += 'semi-expanded';
    }

    return (
      <Fragment>
        <section className={className}>
          <BrowserBar expanded={false} drawerOpened={drawerOpened} />
          <div className="browser-canvas-wrapper" onClick={this.closeDrawer}>
            <div className="browser-canvas">
              {this.props.children}
            </div>
          </div>
        </section>
        <TrackPanel toggleBrowser={this.toggleBrowser} updateCurrentTrackName={this.updateCurrentTrackName} />
        {drawerOpened && <Track currentTrack={this.state.currentTrack}>{this.props.trackRoutes}</Track>}
      </Fragment>
    );
  }
}

export default withRouter((props: BrowserProps) => <Browser {...props} />);
