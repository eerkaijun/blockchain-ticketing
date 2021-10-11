import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Spinner,
  //Row,
  //Col,
  //Container,
  //Table,
} from "react-bootstrap";
import {
  accountSelector,
  marketplaceSelector,
  web3Selector,
  marketplaceStateSelector,
} from "../store/selectors";
import {
  loadAllTickets,
  subscribeToEvents,
  startInvestment,
} from "../store/interactions";
import Tickets from "./Tickets";

class Content extends Component {
  async componentWillMount() {
    await this.loadTicketsData();
  }

  async loadTicketsData() {
    const { dispatch, marketplace, web3 } = this.props;
    await loadAllTickets(marketplace, dispatch);
    await subscribeToEvents(web3, marketplace, dispatch);
    // await loadMarketplaceState(marketplace, dispatch);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">Nice cinema places picture here</div>
        </div>

        {this.props.marketplaceState ? (
          <div className="row">
            <div className="col">
              {/* creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart  */}
              {this.props.marketplaceState == "creatingTickets" ? (
                <Button
                  variant="primary"
                  onClick={(e) => {
                    startInvestment(
                      this.props.dispatch,
                      this.props.marketplace,
                      this.props.account
                    );
                  }}
                  className="action-button"
                  style={{ float: "right" }}
                >
                  Start Investment
                </Button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ) : (
          <Spinner type="table" />
        )}

        {/* <div className="row">
          <div className="col">
            {this.props.marketplaceState[1] == "creatingTickets" ? (
              <Button
                variant="primary"
                // onClick={(e) => {
                //   buyTicket(dispatch, marketplace, web3, ticket, account);
                // }}
                className="action-button"
              >
                Start Investment
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        </div> */}

        <div className="row">
          <div className="col">
            <Tickets />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // const marketplaceState = marketplaceStateSelector(state);
  return {
    web3: web3Selector(state),
    account: accountSelector(state),
    marketplace: marketplaceSelector(state),
    marketplaceState: marketplaceStateSelector(state)[1],
  };
}

export default connect(mapStateToProps)(Content);
