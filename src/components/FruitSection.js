import React, { useState } from 'react';
import FruitsDefinitionsModal from './FruitsDefinitionsModal';

const FruitSection = ({ selectedFruits, onFruitToggle }) => {
  const [showDefinitionsModal, setShowDefinitionsModal] = useState(false);
  
  const fruits = [
    { value: 'love', label: 'Love' },
    { value: 'joy', label: 'Joy' },
    { value: 'peace', label: 'Peace' },
    { value: 'patience', label: 'Patience' },
    { value: 'kindness', label: 'Kindness' },
    { value: 'goodness', label: 'Goodness' },
    { value: 'faithfulness', label: 'Faithfulness' },
    { value: 'gentleness', label: 'Gentleness' },
    { value: 'self-control', label: 'Self-control' }
  ];

  return (
    <div className="fruit-section">
      <h2 className="section-title d-flex align-items-center justify-content-between">
        <div className="flex-grow-1 text-center">Fruits of the Spirit</div>
        <button 
          type="button" 
          className="btn btn-link p-0" 
          onClick={() => setShowDefinitionsModal(true)}
        >
          <i className="bi bi-question-circle-fill text-dark opacity-75 hover-opacity-100"></i>
        </button>
      </h2>
      <p className="text-center mb-4">
        In what ways did you operate in the Spirit today? Click on each fruit that was evident in your life.
      </p>
      <div className="table-container">
        <table className="clickable-table">
          <tbody>
            <tr>
              {fruits.slice(0, 3).map(fruit => (
                <td 
                  key={fruit.value}
                  data-value={fruit.value}
                  className={selectedFruits.includes(fruit.value) ? 'selected' : ''}
                  onClick={() => onFruitToggle(fruit.value)}
                >
                  {fruit.label}
                </td>
              ))}
            </tr>
            <tr>
              {fruits.slice(3, 6).map(fruit => (
                <td 
                  key={fruit.value}
                  data-value={fruit.value}
                  className={selectedFruits.includes(fruit.value) ? 'selected' : ''}
                  onClick={() => onFruitToggle(fruit.value)}
                >
                  {fruit.label}
                </td>
              ))}
            </tr>
            <tr>
              {fruits.slice(6, 9).map(fruit => (
                <td 
                  key={fruit.value}
                  data-value={fruit.value}
                  className={selectedFruits.includes(fruit.value) ? 'selected' : ''}
                  onClick={() => onFruitToggle(fruit.value)}
                >
                  {fruit.label}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      <FruitsDefinitionsModal 
        show={showDefinitionsModal}
        onHide={() => setShowDefinitionsModal(false)}
      />
    </div>
  );
};

export default FruitSection; 