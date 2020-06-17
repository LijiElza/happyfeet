import React from 'react';
import { Modal, Button, Card, Table } from 'react-bootstrap'
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'
import { toast } from 'react-toastify'
toast.configure()
class CartDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: props.cart,
            show: true
        }
    }
    handleClose = () => {
        this.setState({ show: false })
        this.props.hideCart()
    }
    HandleToken = (token, address) => {
        var price = 0;
        this.state.cart.map((item) => {
            price = parseInt(price) + (parseInt(item.discount_price)*parseInt(item.count));
        })
        price=price*100;
        if (token) {
            return axios.post(
                "http://localhost:3000/checkout",
                { token, price }
            ).then((response) => {
                const { status } = response.data;
                if (status === "success") {
                    this.props.hideCart();
                    this.props.CartCheckoutCompleted()
                    toast("Checokut Completed!", { type: "success" });
                } else {
                    toast("Something went wrong Try again", { type: "error" });
                }
            });


        }
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
                    <Modal.Footer>
                        <StripeCheckout
                            stripeKey="pk_test_51GudyFAEkbUpGireDm2PNWSDD2023taW5C1KWD7BYRz11MCu16kcuRKO1qHIZaLOFArYj7PFAeruDTRYjHTMKyCg00HSl8zXLv"
                            token={this.HandleToken}
                            billingAddress
                            shippingAddress>

                        </StripeCheckout>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default CartDisplay;
