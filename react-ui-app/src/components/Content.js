import React, { Component, Fragment } from "react";
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
  investorUnitsSelector,
  numTicketsSelector,
  isMarketplaceOwnerAccountSelector,
} from "../store/selectors";
import {
  loadAllTickets,
  subscribeToEvents,
  startInvestment,
  stopInvestment,
  startTicketSale,
  startEvent,
  retrieve,
  loadInvestmentSold,
  loadInvestorUnits,
} from "../store/interactions";
import Tickets from "./Tickets";
import Invest from "./Invest";

class Content extends Component {
  async componentWillMount() {
    await this.loadTicketsData();
  }

  async loadTicketsData() {
    const { dispatch, marketplace, web3, account } = this.props;
    await loadAllTickets(marketplace, dispatch);
    await subscribeToEvents(web3, marketplace, dispatch);
    await loadInvestmentSold(marketplace, dispatch);
    await loadInvestorUnits(marketplace, account, dispatch);
  }

  render() {
    const {
      isMarketplaceOwnerAccount,
      marketplaceState,
      numTickets,
      dispatch,
      marketplace,
      account,
      investorUnits,
    } = this.props;
    return (
      <Container>
        {/* <div className="container"> */}

        <Row>
          <Col>Nice cinema places picture here</Col>
        </Row>

        {marketplaceState ? (
          <>
            <Row>
              {/* creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart  */}
              {marketplaceState == "creatingTickets" &&
              isMarketplaceOwnerAccount ? (
                numTickets > 0 ? (
                  <Col>
                    <Button
                      variant="primary"
                      onClick={(e) => {
                        startInvestment(dispatch, marketplace, account);
                      }}
                      className="action-button"
                      style={{ float: "right" }}
                    >
                      Start Investment
                    </Button>
                  </Col>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}

              {marketplaceState == "investmentStart" &&
              isMarketplaceOwnerAccount ? (
                <Col>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      stopInvestment(dispatch, marketplace, account);
                    }}
                    className="action-button"
                    style={{ float: "right" }}
                  >
                    Stop Investment
                  </Button>
                </Col>
              ) : (
                <></>
              )}

              {marketplaceState == "investmentStop" &&
              isMarketplaceOwnerAccount ? (
                <Col>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      startTicketSale(dispatch, marketplace, account);
                    }}
                    className="action-button"
                    style={{ float: "right" }}
                  >
                    Start Tickets Sale
                  </Button>
                </Col>
              ) : (
                <></>
              )}

              {marketplaceState == "ticketSaleStart" &&
              isMarketplaceOwnerAccount ? (
                <Col>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      startEvent(dispatch, marketplace, account);
                    }}
                    className="action-button"
                    style={{ float: "right" }}
                  >
                    Start Event
                  </Button>
                </Col>
              ) : (
                <></>
              )}

              {marketplaceState == "eventStart" && investorUnits > 0 ? (
                <Col>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      retrieve(
                        this.props.dispatch,
                        this.props.marketplace,
                        this.props.account
                      );
                    }}
                    className="action-button"
                    style={{ float: "right" }}
                  >
                    Retrieve Investments
                  </Button>
                </Col>
              ) : (
                <></>
              )}
            </Row>
            <Row className="add-space">
              {/* <Col>1 of 1</Col> */}
              <Col>
                {/* <div className="col"> */}
                {marketplaceState == "investmentStart" ? <Invest /> : <></>}
              </Col>
            </Row>

            <Row>
              <Col>
                <Tickets />
              </Col>
            </Row>
          </>
        ) : (
          <Spinner type="table" />
        )}
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
    investmentSold: investmentSoldSelector(state),
    investorUnits: investorUnitsSelector(state),
    numTickets: numTicketsSelector(state),
    isMarketplaceOwnerAccount: isMarketplaceOwnerAccountSelector(state),
  };
}

export default connect(mapStateToProps)(Content);
