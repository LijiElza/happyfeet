import React from 'react';
import { Modal, Button, Card, Table } from 'react-bootstrap'
class purchaseHistoryDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: props.cart,
            show: true     
        }
    }
    handleClose = () => {
        this.setState({ show: false })
        this.props.hidePurchaseHistory()
    }
    render() {
        return (
            <div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton> </Modal.Header>
                    <Modal.Body>
                        <Table variant="light" size="sm">
                            <tbody>
                                {this.state.cart.map((item, index) =>
                                    (
                                        <tr>
                                            <div style={{ border: "solid 1px black", marginBottom: "1rem" }}>
                                                <td colSpan="2"> <img src={require('./images/' + item.image)} style={{ height: '6rem', width: '6rem', marginLeft: "1rem" }} />
                                                </td>
                                                <td>{item.name}<br></br><label>Colour:</label> {item.colour}</td>

                                                <td colSpan="1" style={{ alignItems: "center", paddingTop: "2rem", marginLeft: "2rem" }}>${item.discount_price}</td>

                                                <td colSpan="1" style={{ alignItems: "center", paddingTop: "2rem", marginLeft: "2rem" }}>Quantity:{item.count}</td>
                                            </div>
                                        </tr>

                                    )

                                )}

                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default purchaseHistoryDisplay;
