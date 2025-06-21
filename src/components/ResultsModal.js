import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ResultsModal = ({ show, onHide, selectedDate }) => {
  const [activeTab, setActiveTab] = useState('current-date');
  const [currentData, setCurrentData] = useState({ fruits: [], flesh: [] });
  const [allData, setAllData] = useState({ fruits: [], flesh: [] });

  useEffect(() => {
    if (show) {
      loadCurrentData();
      loadAllData();
    }
  }, [show, selectedDate]);

  const loadCurrentData = () => {
    const data = localStorage.getItem(`data_${selectedDate}`);
    if (data) {
      setCurrentData(JSON.parse(data));
    } else {
      setCurrentData({ fruits: [], flesh: [] });
    }
  };

  const loadAllData = () => {
    const allFruits = [];
    const allFlesh = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('data_')) {
        const data = JSON.parse(localStorage.getItem(key));
        allFruits.push(...data.fruits);
        allFlesh.push(...data.flesh);
      }
    }
    
    setAllData({ fruits: allFruits, flesh: allFlesh });
  };

  const createChartData = (fruits, flesh, title) => {
    const fruitCounts = {};
    const fleshCounts = {};

    fruits.forEach(fruit => {
      fruitCounts[fruit] = (fruitCounts[fruit] || 0) + 1;
    });

    flesh.forEach(work => {
      fleshCounts[work] = (fleshCounts[work] || 0) + 1;
    });

    const fruitLabels = Object.keys(fruitCounts);
    const fleshLabels = Object.keys(fleshCounts);

    return {
      fruits: {
        labels: fruitLabels,
        datasets: [{
          data: fruitLabels.map(label => fruitCounts[label]),
          backgroundColor: [
            '#28a745', '#20c997', '#17a2b8', '#007bff', '#6f42c1',
            '#e83e8c', '#fd7e14', '#ffc107', '#6c757d'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      flesh: {
        labels: fleshLabels,
        datasets: [{
          data: fleshLabels.map(label => fleshCounts[label]),
          backgroundColor: [
            '#dc3545', '#fd7e14', '#ffc107', '#6c757d', '#343a40',
            '#e83e8c', '#6f42c1', '#007bff', '#17a2b8', '#20c997',
            '#28a745', '#fd7e14', '#ffc107', '#6c757d', '#343a40'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      }
    };
  };

  const currentChartData = createChartData(currentData.fruits, currentData.flesh, 'Current Date');
  const allChartData = createChartData(allData.fruits, allData.flesh, 'All Time');

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Daily Spiritual Inventory Results</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="nav nav-pills nav-fill mb-4" role="tablist">
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeTab === 'current-date' ? 'active' : ''}`}
              onClick={() => setActiveTab('current-date')}
            >
              Today
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeTab === 'all-dates' ? 'active' : ''}`}
              onClick={() => setActiveTab('all-dates')}
            >
              All Time
            </button>
          </li>
        </ul>
        
        <div className="tab-content">
          <div className={`tab-pane fade ${activeTab === 'current-date' ? 'show active' : ''}`}>
            <div className="row">
              <div className="col-lg-6">
                <div className="chart-container">
                  <h5 className="text-center mb-3">Fruits of the Spirit</h5>
                  <Doughnut 
                    data={currentChartData.fruits}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="chart-container">
                  <h5 className="text-center mb-3">Works of the Flesh</h5>
                  <Doughnut 
                    data={currentChartData.flesh}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className={`tab-pane fade ${activeTab === 'all-dates' ? 'show active' : ''}`}>
            <div className="row">
              <div className="col-md-6">
                <div className="chart-container">
                  <h5 className="text-center mb-3">Fruits of the Spirit (All Time)</h5>
                  <Doughnut 
                    data={allChartData.fruits}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="chart-container">
                  <h5 className="text-center mb-3">Works of the Flesh (All Time)</h5>
                  <Doughnut 
                    data={allChartData.flesh}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResultsModal; 