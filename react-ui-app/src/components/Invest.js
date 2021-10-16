import React, { Component } from "react";
import { connect } from "react-redux";
import {
  //Modal,
  //Tabs,
  //Tab,
  Button,
  //Row,
  //Col,
  //Container,
  //Table,
} from "react-bootstrap";
import Spinner from "./Spinner";
import ChangePriceModal from "./ChangePriceModal";
import CreateTicketModal from "./CreateTicketModal";
import InvestModal from "./InvestModal";

import {
  accountSelector,
  ticketsLoadedSelector,
  ticketsSelector,
  marketplaceSelector,
  saleTogglingSelector,
  modalSelector,
  ticketPriceChangingSelector,
  web3Selector,
  marketplaceStateSelector,
  numTicketsSelector,
  investmentSoldSelector,
} from "../store/selectors";
import { toggleSale, buyTicket } from "../store/interactions";
//import { openModal, closeModal } from "../store/actions";
import { openModal } from "../store/actions";

// // const showTickets = (props, parentState, handleClose, handleShow) => {
// const showTickets = (props, handleShow) => {
//   const { tickets, dispatch, marketplace, account, web3, marketplaceState } =
//     props;

//   // console.log("!!!!showTickets props", props);
//   return (
//     <tbody>
//       {tickets.map((ticket, ind) => {
//         // console.log("!!!!!Tickets marketplaceState: ", marketplaceState);
//         return (
//           <tr className={``} key={ticket.ticket_id}>
//             <td>{ind}</td>
//             <td>{ticket.seat_number}</td>
//             <td>{ticket.ticket_value}</td>
//             <td>{ticket.ticket_category}</td>
//             <td>{ticket.ticket_id}</td>
//             <td>{ticket.on_sale.toString()}</td>

//             <td>
//               {/* TODO use marketplaceState[1] to hide/show buttons depend on the marketplaceState
//             creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart  */}
//               {ticket.on_sale && marketplaceState === "ticketSaleStart" ? (
//                 <Button
//                   variant="primary"
//                   onClick={(e) => {
//                     buyTicket(dispatch, marketplace, web3, ticket, account);
//                   }}
//                   className="action-button"
//                 >
//                   Buy Ticket
//                 </Button>
//               ) : (
//                 <div></div>
//               )}

//               <Button
//                 variant="primary"
//                 onClick={(e) => dispatch(openModal("ChangePrice", ticket))}
//                 className="action-button"
//               >
//                 Change Price
//               </Button>
//               <Button
//                 onClick={(e) => {
//                   toggleSale(dispatch, marketplace, ticket, account);
//                 }}
//                 className="action-button"
//               >
//                 Toggle Sale
//               </Button>
//               {/* <v-btn class="mx-2" dark color="green" v-on:click="toggleSale(props.item.ticket_id)"> */}
//               {/* Toggle Sale */}
//               {/* </v-btn> */}
//               {/* async toggleSale(id) {
//      await this.contract.methods.toggleSale(id).send({from:this.account});
//       console.log("Ticket put on sale!"); */}
//             </td>
//           </tr>
//         );
//       })}
//     </tbody>
//   );
// };

class Invest extends Component {
  render() {
    const { numTickets, investmentSold } = this.props;
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">Invest into the Event</div>
        <div className="card-body">
          {/* creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart  */}

          <div>Your collateral units: {"TODO:::"}</div>
          <p></p>

          <div>Total units for collateral: {numTickets}</div>
          <div>Sold collateral units: {investmentSold}</div>
          <div>Available collateral units: {numTickets - investmentSold}</div>
          <div>Investment price : 3 SHY per unit(ticket)</div>
          {this.props.marketplaceState === "investmentStart" ? (
            <Button
              variant="primary"
              onClick={(e) => this.props.dispatch(openModal("Invest"))}
              style={{ float: "right" }}
            >
              Invest
            </Button>
          ) : (
            <></>
          )}
        </div>

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

        {!!this.props.modal &&
        !!this.props.modal.modal &&
        this.props.modal.modal.type === "Invest" ? (
          <InvestModal />
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
  const ticketPriceChanging = ticketPriceChangingSelector(state);

  return {
    ticketsLoaded: ticketsLoaded && !saleToggling && !ticketPriceChanging,
    marketplace: marketplaceSelector(state),
    tickets: ticketsSelector(state),
    account: accountSelector(state),
    modal: modalSelector(state),
    web3: web3Selector(state),
    marketplaceState: marketplaceStateSelector(state)[1],

    numTickets: numTicketsSelector(state),

    investmentSold: investmentSoldSelector(state),
  };
}

export default connect(mapStateToProps)(Invest);
