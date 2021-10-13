import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Spinner,
  Row,
  Col,
  Container,
  //Table,
} from "react-bootstrap";
import {
  accountSelector,
  marketplaceSelector,
  web3Selector,
  marketplaceStateSelector,
  investmentSoldSelector,
} from "../store/selectors";
import {
  loadAllTickets,
  subscribeToEvents,
  startInvestment,
  loadInvestmentSold,
} from "../store/interactions";
import Tickets from "./Tickets";
import Invest from "./Invest";

class Content extends Component {
  async componentWillMount() {
    await this.loadTicketsData();
  }

  async loadTicketsData() {
    const { dispatch, marketplace, web3 } = this.props;
    await loadAllTickets(marketplace, dispatch);
    await subscribeToEvents(web3, marketplace, dispatch);
    await loadInvestmentSold(marketplace, dispatch);
  }

  render() {
    return (
      <Container>
        {/* <div className="container"> */}

        <div className="row">
          <div className="col">Nice cinema places picture here</div>
        </div>

        {this.props.marketplaceState ? (
          <div className="row">
            {/* creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart  */}
            {this.props.marketplaceState == "creatingTickets" ? (
              <div className="col">
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
              </div>
            ) : (
              <div></div>
            )}

            {/* <div className="row"> */}
            <Row>
              <Col>1 of 1</Col>
              <Col>
                {/* <div className="col"> */}
                {this.props.marketplaceState == "investmentStart" ? (
                  <Invest />
                ) : (
                  <div></div>
                )}
                {/* </div> */}
              </Col>
            </Row>
            {/* </div> */}

            <div className="row">
              <div className="col">
                <Tickets />
              </div>
            </div>
          </div>
        ) : (
          <Spinner type="table" />
        )}

        {/* <div className="row">
          <div className="col">
            <Tickets />
          </div>
        </div> */}
        {/* </div> */}
      </Container>
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
    investmentSold: investmentSoldSelector,
  };
}

export default connect(mapStateToProps)(Content);
