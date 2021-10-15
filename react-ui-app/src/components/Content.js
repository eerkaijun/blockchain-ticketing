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
    return (
      <Container>
        {/* <div className="container"> */}

        <Row>
          <Col>Nice cinema places picture here</Col>
        </Row>

        {this.props.marketplaceState ? (
          <>
            <Row>
              {/* creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart  */}
              {this.props.marketplaceState == "creatingTickets" ? (
                this.props.numTickets > 0 ? (
                  <Col>
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
                  </Col>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}

              {this.props.marketplaceState == "investmentStart" ? (
                <Col>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      stopInvestment(
                        this.props.dispatch,
                        this.props.marketplace,
                        this.props.account
                      );
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

              {this.props.marketplaceState == "investmentStop" ? (
                <Col>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      startTicketSale(
                        this.props.dispatch,
                        this.props.marketplace,
                        this.props.account
                      );
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

              {this.props.marketplaceState == "ticketSaleStart" ? (
                <Col>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      startEvent(
                        this.props.dispatch,
                        this.props.marketplace,
                        this.props.account
                      );
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

              {this.props.marketplaceState == "eventStart" &&
              this.props.investorUnits > 0 ? (
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
            <Row>
              {/* <Col>1 of 1</Col> */}
              <Col>
                {/* <div className="col"> */}
                {this.props.marketplaceState == "investmentStart" ? (
                  <Invest />
                ) : (
                  <></>
                )}
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
  };
}

export default connect(mapStateToProps)(Content);
