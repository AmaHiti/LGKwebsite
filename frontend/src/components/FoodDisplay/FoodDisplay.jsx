import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../context/StoreContex';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { foodList } = useContext(StoreContext);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const divideIntoRows = () => {
      const itemsPerRow = 4;
      
      if (!foodList || !Array.isArray(foodList)) {
        setRows([]); 
        return;
      }

      let filteredFoodList = foodList;
      if (category !== 'All') {
        filteredFoodList = foodList.filter((item) => item.category === category);
      }

   
      filteredFoodList = filteredFoodList.filter(item => item.category !== 'Offers');

      if (!filteredFoodList || filteredFoodList.length === 0) {
        setRows([]); 
      }

      const dividedRows = [];
      for (let i = 0; i < filteredFoodList.length; i += itemsPerRow) {
        dividedRows.push(filteredFoodList.slice(i, i + itemsPerRow));
      }
      setRows(dividedRows);
    };

    divideIntoRows();
  }, [foodList, category]);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      {rows.map((row, index) => (
        <div key={index} className="food-display-row">
          {row.map((item) => (
            <FoodItem
              key={item.FoodID}
              id={item.FoodID}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default FoodDisplay;
