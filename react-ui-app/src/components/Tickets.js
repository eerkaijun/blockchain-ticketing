import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Modal,
  Tabs,
  Tab,
  Button,
  Row,
  Col,
  Container,
  Table,
} from "react-bootstrap";
import Spinner from "./Spinner";
import ChangePriceModal from "./ChangePriceModal";
import CreateTicketModal from "./CreateTicketModal";

import {
  accountSelector,
  ticketsLoadedSelector,
  ticketsSelector,
  marketplaceSelector,
  saleTogglingSelector,
  modalSelector,
} from "../store/selectors";
import { toggleSale } from "../store/interactions";
import { openModal, closeModal } from "../store/actions";

// const showTickets = (props, parentState, handleClose, handleShow) => {
const showTickets = (props, handleShow) => {
  const { tickets, dispatch, marketplace, account } = props;

  console.log("!!!!showTickets props", props);
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
              <Button
                variant="primary"
                onClick={(e) => dispatch(openModal("ChangePrice", ticket))}
              >
                Change Price
              </Button>
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
  ////////////////Modal demo////////////////////////
  state = {
    show: false,
  };

  setShow = (isShow) => {
    this.setState({ show: isShow });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };

  /////////////////////end Modal demo//////////////
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
              showTickets(
                this.props,
                // this.state,
                // this.handleClose,
                this.handleShow
              )
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

        <Button
          variant="primary"
          onClick={(e) => this.props.dispatch(openModal("CreateTicket"))}
        >
          Create Ticket
        </Button>

        {!!this.props.modal &&
        !!this.props.modal.modal &&
        this.props.modal.modal.type === "ChangePrice" ? (
          <ChangePriceModal />
        ) : (
          <div></div>
        )}

        {!!this.props.modal &&
        !!this.props.modal.modal &&
        this.props.modal.modal.type === "CreateTicket" ? (
          <CreateTicketModal />
        ) : (
          <div></div>
        )}
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
    modal: modalSelector(state),
    // setShow: this.setShow,
  };
}

export default connect(mapStateToProps)(Tickets);
