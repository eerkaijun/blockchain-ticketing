import React, { Component } from "react";
import { connect } from "react-redux";

import { accountSelector, marketplaceSelector } from "../store/selectors";
import {
  loadAllTickets,
  subscribeToEvents,
  createTicket,
} from "../store/interactions";
import Tickets from "./Tickets";

class Content extends Component {
  async componentWillMount() {
    await this.loadTicketsData();
  }

  async loadTicketsData() {
    const { dispatch, marketplace } = this.props;
    await loadAllTickets(marketplace, dispatch);
    await subscribeToEvents(marketplace, dispatch);
    // await createTicket(
    //   "789",
    //   31,
    //   32,
    //   this.props.marketplace,
    //   this.props.account,
    //   dispatch
    // );
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            Nice cinema places picture here
            <Tickets />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: accountSelector(state),
    marketplace: marketplaceSelector(state),
  };
}

export default connect(mapStateToProps)(Content);