import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Tab, Button, Row, Col, Container, Table } from "react-bootstrap";
import Spinner from "./Spinner";
import {
  accountSelector,
  ticketsLoadedSelector,
  ticketsSelector,
  marketplaceSelector,
  saleTogglingSelector,
} from "../store/selectors";
import { toggleSale } from "../store/interactions";

const showTickets = (props) => {
  const { tickets, dispatch, marketplace, account } = props;
  // console.log("!!!!showTickets props", props);
  return (
    <tbody>
      {tickets.map((ticket, ind) => {
        return (
          <tr className={``} key={ticket.ticket_id}>
            <td>{ind}</td>
            <td>{ticket.seat_number}</td>
            <td>{ticket.ticket_value}</td>
            <td>{ticket.ticket_category}</td>
            <td>{ticket.ticket_id}</td>
            <td>{ticket.on_sale.toString()}</td>

            <td>
              <Button>Change Price</Button>
              <Button
                onClick={(e) => {
                  toggleSale(dispatch, marketplace, ticket, account);
                }}
              >
                Toggle Sale
              </Button>
              {/* <v-btn class="mx-2" dark color="green" v-on:click="toggleSale(props.item.ticket_id)"> */}
              {/* Toggle Sale */}
              {/* </v-btn> */}
              {/* async toggleSale(id) {
     await this.contract.methods.toggleSale(id).send({from:this.account});
      console.log("Ticket put on sale!"); */}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

class Tickets extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">Tickets in the Marketplace</div>
        <div className="card-body">
          <table className="table table-dark table-sm small">
            <thead>
              <tr>
                <th>#</th>
                <th>Seat Number</th>
                <th>Ticket Price (in ETH)</th>
                <th>Category</th>
                <th>Ticket ID</th>
                <th>On Sale</th>
                <th>Actions</th>
              </tr>
            </thead>
            {this.props.ticketsLoaded ? (
              showTickets(this.props)
            ) : (
              // <tbody>
              //   <tr>
              //     <td colSpan="4">
              //       <Spinner type="table" />
              //     </td>
              //   </tr>
              // </tbody>
              <Spinner type="table" />
            )}
          </table>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const ticketsLoaded = ticketsLoadedSelector(state);
  const saleToggling = saleTogglingSelector(state);
  return {
    ticketsLoaded: ticketsLoaded && !saleToggling,
    marketplace: marketplaceSelector(state),
    tickets: ticketsSelector(state),
    account: accountSelector(state),
  };
}

export default connect(mapStateToProps)(Tickets);
