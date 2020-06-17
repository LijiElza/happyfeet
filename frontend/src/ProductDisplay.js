import React from 'react';
import { Card, Button, Image, Navbar, Nav, Form, FormControl, ListGroup, DropdownButton, Dropdown, Modal, Badge } from 'react-bootstrap'
import StarRatings from 'react-star-ratings';
import { BsSearch, BsTriangleHalf } from "react-icons/bs";
import './productDisplay.css'
class ProductDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: this.props.Products,
            min_price: null,
            max_price: null,
            brand: null,
            colour: [],
            showSuggestions: false
        }
    }
    MinPriceChange = (e) => {
        var newproducts = ''
        var max_price = this.state.max_price
        if (this.state.max_price == null) {
            newproducts = this.props.Products.filter(function (item) {
                if (item.discount_price >= e) {
                    return item
                }
            })
        }
        else {
            newproducts = this.props.Products.filter(function (item) {
                if (item.discount_price >= e && item.discount_price <= max_price) {
                    return item
                }
            })
        }
        this.setState({
            products: newproducts, min_price: e
        })

    }
    MaxPriceChange = (e) => {
        var newproducts = '';
        var min_price = this.state.min_price
        if (this.state.min_price == null) {
            newproducts = this.props.Products.filter(function (item) {
                if (item.discount_price <= e) {
                    return item
                }
            })
        }
        else {
            newproducts = this.props.Products.filter(function (item) {
                if (item.discount_price <= e && item.discount_price >= min_price) {
                    return item
                }
            })
        }
        this.setState({
            products: newproducts, max_price: e
        })
    }
    ColourChanged = (e) => {
        var colorIncluded = false;
        var colorArray = this.state.colour;
        this.state.colour.filter(function (item) {
            if (item === e) {
                colorIncluded = true;
            }
        })
        if (!colorIncluded) {
            colorArray.push(e);
            var newproducts = []
            colorArray.map((colour) => {
                (this.props.Products.filter(function (item) {
                    if (item.colour == colour) {
                        newproducts.push(item)
                    }
                }))
            })
            this.setState({ colour: colorArray, products: newproducts })
        }
        else {
            const colorRemovedArray = this.state.colour.filter(function (item) {
                return item !== e
            })
            var newproducts = [];
            if (colorRemovedArray.length == 0) {
                newproducts = this.props.Products;
            }
            else {
                colorRemovedArray && colorRemovedArray.map((colour) => {
                    (this.props.Products.filter(function (item) {
                        if (item.colour == colour) {
                            newproducts.push(item)
                        }
                    }))
                })
            }

            this.setState({ colour: colorRemovedArray, products: newproducts })
        }

    }

    addToCart = (item) => {
        item.count = 1;
        this.props.UpdateCart(item)
    }

    sortproducts = (criteria) => {
        if (criteria == "low-high") {
            var sortedProductsAsc = this.state.products.sort((a, b) => {
                return a.discount_price - b.discount_price;
            })
            this.setState({ products: sortedProductsAsc })
        }
        else if (criteria == "high-low") {

            var sortedProductsDsc = this.state.products.sort((a, b) => {
                return b.discount_price - a.discount_price;
            })
            this.setState({ products: sortedProductsDsc })
        }
        else if (criteria === "relevence") {
            var sortedProductsDsc = this.state.products.sort((a, b) => {
                return b.rating - a.rating;
            })
            this.setState({ products: sortedProductsDsc })
        }
    }
    clearfilter = () => {
        this.setState({ min_price: null, max_price: null, colour: [], products: this.props.Products })
    }
    filterWithBrand = (e) => {
        var sortedProductsDsc = this.props.Products.filter((item) => {
            return item.brand===e.target.value
        })
        if(sortedProductsDsc.length>0){
            this.setState({ products: sortedProductsDsc })
        }
        if(e.target.value===''){
            this.setState({products:this.props.Products})
        }
    }
    render() {
        return (
            <div>
                <div className="filterBox">
                    <Card style={{ width: '18rem', marginLeft: "1rem" }}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Filters {'  '} <Button style={{ float: "right" }} variant="outline-secondary" size="sm" onClick={this.clearfilter}>clear</Button></ListGroup.Item>
                            <ListGroup.Item><div>
                                <label>Price</label> {'    '}
                                <span>
                                    <DropdownButton onSelect={this.MinPriceChange} className="div-inline" variant="outline-secondary" size="sm" title={this.state.min_price !== null ? this.state.min_price : "Min"}>
                                        <Dropdown.Item eventKey="20">$20</Dropdown.Item>
                                        <Dropdown.Item eventKey="40">$40</Dropdown.Item>
                                        <Dropdown.Item eventKey="50">$50</Dropdown.Item>
                                    </DropdownButton>
                                    <label>to</label> {'  '}
                                    <DropdownButton onSelect={this.MaxPriceChange} className="div-inline" variant="outline-secondary" size="sm" title={this.state.max_price !== null ? this.state.max_price : "Max"}>
                                        <Dropdown.Item eventKey="80">$80</Dropdown.Item>
                                        <Dropdown.Item eventKey="90">$90</Dropdown.Item>
                                        <Dropdown.Item eventKey="100">$100</Dropdown.Item>
                                    </DropdownButton>
                                </span>
                            </div></ListGroup.Item>
                            <ListGroup.Item><span>
                                <Form inline>
                                    <FormControl type="text" onChange={this.filterWithBrand} placeholder="Search Brand" className="mr-sm-2"  />
                                    <BsSearch ></BsSearch>
                                    <label style={{color:"grey",fontSize:"0.7rem"}}>ex:-puma,pace,amazon,addiddas</label>
                                </Form>
                            </span></ListGroup.Item>
                            <ListGroup.Item>
                                <div>
                                    <label>Colour</label>
                                    <ListGroup.Item >
                                        <form>
                                            <Form.Group >
                                                <Form.Check onChange={() => { this.ColourChanged("white") }} type="checkbox" label="white" />
                                            </Form.Group>
                                        </form>
                                    </ListGroup.Item>
                                    <ListGroup.Item >
                                        <form>
                                            <Form.Group >
                                                <Form.Check onChange={() => { this.ColourChanged("black") }} type="checkbox" label="black" />
                                            </Form.Group>
                                        </form>
                                    </ListGroup.Item>
                                    <ListGroup.Item >
                                        <form>
                                            <Form.Group>
                                                <Form.Check onChange={() => { this.ColourChanged("blue") }} type="checkbox" label="blue" />
                                            </Form.Group>
                                        </form>
                                    </ListGroup.Item>
                                    <ListGroup.Item >
                                        <form>
                                            <Form.Group >
                                                <Form.Check onChange={() => { this.ColourChanged("brown") }} type="checkbox" label="brown" />
                                            </Form.Group>
                                        </form>
                                    </ListGroup.Item>
                                    <ListGroup.Item >
                                        <form>
                                            <Form.Group >
                                                <Form.Check onChange={() => { this.ColourChanged("red") }} type="checkbox" label="red" />
                                            </Form.Group>
                                        </form>
                                    </ListGroup.Item>
                                    <ListGroup.Item >
                                        <form>
                                            <Form.Group >
                                                <Form.Check onChange={() => { this.ColourChanged("green") }} type="checkbox" label="green" />
                                            </Form.Group>
                                        </form>
                                    </ListGroup.Item>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </div>
                <div className="row">
                    <div style={{ width: "100%", marginLeft: "1rem" }}>
                        <Navbar bg="light" variant="light">
                            <Navbar>Sort By</Navbar>
                            <Nav>
                                <Nav.Link onClick={() => { this.sortproducts("relevence") }}>Relevance</Nav.Link>
                                {' '}
                                <Nav.Link onClick={() => { this.sortproducts("low-high") }}>Low-High</Nav.Link>
                                {' '}
                                <Nav.Link onClick={() => { this.sortproducts("high-low") }}>High-Low</Nav.Link>
                            </Nav>
                            <div class="form-inline my-2 my-lg-0">
                                <label>{' '}Result({ this.state.products.length})</label>
                            </div>
                        </Navbar>
                    </div>
                    { this.state.products.map((item, index) =>
                        (
                            <div className="col-sm-4">
                                <Card style={{ width: '17rem', height: '22rem', marginBottom: "1rem" }}>
                                    <Image variant="top" style={{ height: '10rem', width: '10rem', marginLeft: "4rem" }} src={require('./images/' + item.image)} />
                                    <Card.Body>
                                        <Card.Title>{item.name}<br></br>
                                            <StarRatings
                                                rating={item.rating}
                                                starDimension="20px"
                                                starSpacing="5px"
                                            />
                                            <br></br>
                                            <label>${item.discount_price}</label>
                                            {' '}<del style={{ color: "grey", fontSize: "14px" }}>${item.price}</del>
                                        </Card.Title>
                                        <Button onClick={() => { this.addToCart(item) }} variant="outline-secondary">Buy</Button>
                                    </Card.Body>
                                </Card>

                            </div>
                        )
                    )}
                </div>
            </div >
        );
    }
}

export default ProductDisplay;
