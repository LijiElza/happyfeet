import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import ProductDisplay from './ProductDisplay';
import { Navbar, Nav, Badge } from 'react-bootstrap'
import CartDisplay from './CartDisplay';
import PurchaseHistoryDisplay from './PurchaseHistoryDisplay'
import { toast, ToastContainer } from 'react-toastify'
import db from './db.json'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchaseHistory: '',
      cart: [],
      showCart: false,
      productList: [],
      showPurchaseHistory: false,
      dataFetched:false
    };
  }

  componentWillMount() {
    return axios.get("http://localhost:3000/products").then((response) => {
      var productList = response.data.response;
      this.setState({ productList,dataFetched:true })
    })
  }

  UpdateCart = (cart) => {
    var cart_array = this.state.cart;
    var itemIncluded = false;
    if (cart_array.length > 0) {
      cart_array.map((alreadyAddedItem) => {
        if (alreadyAddedItem.id === cart.id) {
          alreadyAddedItem.count = alreadyAddedItem.count + 1;
          itemIncluded = true;
        }
      })
    }
    if (!itemIncluded || cart_array.length === 0) {
      cart_array.push(cart)
    }
    this.setState({ cart: cart_array })
  }

  CartCheckoutCompleted = () => {
    var purchaseHistory = this.state.purchaseHistory;
    if (purchaseHistory.length > 0) {
      this.state.cart.map((item) => {
        purchaseHistory.push(item)
      })
    }
    else if (purchaseHistory.length == 0) {
      purchaseHistory = this.state.cart;
    }
    this.setState({ purchaseHistory, cart: [] })
  }

  HistoryDisplay = () => {
    if (this.state.purchaseHistory.length > 0) {
      this.setState({ showPurchaseHistory: true })
    }
    else {
      alert("no purchase history")
    }

  }
  hidePurchaseHistory = () => {
    this.setState({ showPurchaseHistory: false })
  }

  cartDisplay = () => {
    if (this.state.cart.length > 0) {
      this.setState({ showCart: true })
    }
    else {
      alert("no cart found")
    }
  }
  hideCart = () => {
    this.setState({ showCart: false })
  }
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand >Happy-feet</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => { this.HistoryDisplay() }}>My shoes</Nav.Link>
              {' '}
              <Nav.Link onClick={() => { this.cartDisplay() }}>Cart {this.state.cart.length > 0 ? <Badge variant="light">{this.state.cart.length}</Badge> : null}</Nav.Link>
            </Nav>

          </Navbar.Collapse>
        </Navbar>
        {this.state.showCart ? <CartDisplay hideCart={this.hideCart} cart={this.state.cart} CartCheckoutCompleted={this.CartCheckoutCompleted}></CartDisplay> : null}
        {this.state.showPurchaseHistory ? <PurchaseHistoryDisplay hidePurchaseHistory={() => { this.hidePurchaseHistory() }} cart={this.state.purchaseHistory}> </PurchaseHistoryDisplay> : null}   
        {this.state.dataFetched?<div className="productDisplayBox"><ProductDisplay Products={this.state.productList} UpdateCart={this.UpdateCart}></ProductDisplay></div>:null}
      </div>
    );
  }
}

export default App;
