import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './offers.css';
import { StoreContext } from './context/StoreContex';
import OfferFoodItem from './OfferFooditem/OfferFoodItem';

const AppPricing = () => {
  const { foodList } = useContext(StoreContext);

 
  const offers = foodList.filter(item => item.category === 'Offers');

  return (
    <section id="pricing" className="block pricing-block">
      <hr />
      <Container fluid>
        <div className="title-holder">
          <h2>Offers &amp; Deals</h2>
          <div className="subtitle">Exclusive Deals Await</div>
        </div>
        <Row className="offer-row">
          {offers.map(item => (
            <Col sm={4} key={item.FoodID}>
              <div className='content'>
                <OfferFoodItem
                  id={item.FoodID}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  image={item.image}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default AppPricing;
