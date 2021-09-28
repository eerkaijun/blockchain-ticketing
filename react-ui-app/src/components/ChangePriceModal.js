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
import {
  accountSelector,
  ticketsLoadedSelector,
  ticketsSelector,
  marketplaceSelector,
  saleTogglingSelector,
  modalSelector,
  web3Selector,
} from "../store/selectors";
import { changeTicketPrice } from "../store/interactions";
import { openModal, closeModal, ticketPriceChanged } from "../store/actions";

class ChangePriceModal extends Component {
  state = { price: null };
  render() {
    const ticket = this.props.modal.modal.data;
    console.log("!!!!ChangePriceModal props", this.props);
    console.log("!!!!ChangePriceModal ticket", ticket);

    const { dispatch } = this.props;

    let headerText = "";
    switch (this.props.modal.modal.type) {
      case "ChangePrice":
        headerText = `Change Price`;
        break;
      default:
        headerText = `Other`;
        break;
    }
    return (
      <Modal
        show={true}
        // show={
        //   !!this.props.modal &&
        //   !!this.props.modal.modal &&
        //   this.props.modal.modal.type === "ChangePrice"
        // }
        onHide={(e) => this.props.dispatch(closeModal())}
      >
        <Modal.Header closeButton>
          <Modal.Title>{headerText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Woohoo, you're reading this text in a modal! */}
          <form
          // onSubmit={(event) => {
          //   event.preventDefault()
          //   makeBuyOrder(dispatch, exchange, token, web3, buyOrder, account)
          // }}
          >
            <div className="form-group small">
              <label>Old price</label>
              <div className="input-group">
                <input
                  disabled={true}
                  placeholder={ticket.ticket_value}
                  className="form-control form-control-sm bg-dark text-white"
                />
                {/* <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Buy Amount"
                  // onChange={(e) => dispatch( buyOrderAmountChanged( e.target.value ) )}
                  required
                /> */}
              </div>
            </div>
            <div className="form-group small">
              <label>New Price</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Buy Price"
                  onChange={(e) => (this.state.price = e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={(e) => this.props.dispatch(closeModal())}
          >
            Close
          </Button>
          <Button
            variant="primary"
            // onClick={(e) => this.props.dispatch(closeModal())}
            onClick={(e) => {
              changeTicketPrice(
                this.props.dispatch,
                this.props.marketplace,
                this.props.web3,
                {
                  ...ticket,
                  ticket_value: this.state.price,
                },
                this.props.account
              );
              this.props.dispatch(closeModal());
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    marketplace: marketplaceSelector(state),
    tickets: ticketsSelector(state),
    account: accountSelector(state),
    modal: modalSelector(state),
    web3: web3Selector(state),
    // setShow: this.setShow,
  };
}

export default connect(mapStateToProps)(ChangePriceModal);
