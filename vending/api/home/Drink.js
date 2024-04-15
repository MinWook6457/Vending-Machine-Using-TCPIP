import React from 'react';

function Drink({ name, imageUrl, description, price }) {
  return (
    <div className="drink">
      <img src={imageUrl} />
      <h3>{name}</h3>
      <p>{description}</p>
      <p>Price: {price}</p>
    </div>
  );
}

export default Drink;
