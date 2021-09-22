import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Tab, Button, Row, Col, Container, Table } from "react-bootstrap";
import { accountSelector, marketplaceSelector } from "../store/selectors";
import { loadAllTickets } from "../store/interactions";

class Content extends Component {
  async componentWillMount() {
    await this.loadTicketsData(this.props.dispatch);
  }

  async loadTicketsData(dispatch) {
    await loadAllTickets(this.props.marketplace, dispatch);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">Column</div>
          <div className="col">
            Column
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td colSpan="2">Larry the Bird</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="col">Column</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    // account: accountSelector(state),
    marketplace: marketplaceSelector(state),
  };
}

export default connect(mapStateToProps)(Content);
