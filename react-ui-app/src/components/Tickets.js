import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Tab, Button, Row, Col, Container, Table } from "react-bootstrap";
import {
  accountSelector,
  ticketsLoadedSelector,
  ticketsSelector,
} from "../store/selectors";

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
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>0</td>
                <td>true</td>
                <td>
                  <Button>BUY TICKET</Button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>1</td>
                <td>true</td>
                <td>
                  <Button>BUY TICKET</Button>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td colSpan="2">Larry the Bird</td>
                <td>@twitter</td>
                <td>2</td>
                <td>true</td>
                <td>
                  <Button>BUY TICKET</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ticketsLoaded: ticketsLoadedSelector(state),
    tickets: ticketsSelector(state),
  };
}

export default connect(mapStateToProps)(Tickets);
