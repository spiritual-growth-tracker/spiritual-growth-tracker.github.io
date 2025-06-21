import React, { useState } from 'react';
import FleshDefinitionsModal from './FleshDefinitionsModal';

const FleshSection = ({ selectedFlesh, onFleshToggle }) => {
  const [showDefinitionsModal, setShowDefinitionsModal] = useState(false);
  
  const fleshWorks = [
    { value: 'sexual-immorality', label: 'Sexual Immorality' },
    { value: 'impurity', label: 'Impurity' },
    { value: 'sensuality', label: 'Sensuality' },
    { value: 'idolatry', label: 'Idolatry' },
    { value: 'sorcery', label: 'Sorcery' },
    { value: 'enmity', label: 'Enmity' },
    { value: 'strife', label: 'Strife' },
    { value: 'jealousy', label: 'Jealousy' },
    { value: 'anger', label: 'Fits of Anger' },
    { value: 'rivalries', label: 'Rivalries' },
    { value: 'dissensions', label: 'Dissensions' },
    { value: 'divisions', label: 'Divisions' },
    { value: 'envy', label: 'Envy' },
    { value: 'drunkenness', label: 'Drunkenness' },
    { value: 'orgies', label: 'Orgies' }
  ];

  return (
    <div className="flesh-section">
      <h2 className="section-title d-flex align-items-center justify-content-between">
        <div className="flex-grow-1 text-center">Works of the Flesh</div>
        <button 
          type="button" 
          className="btn btn-link p-0" 
          onClick={() => setShowDefinitionsModal(true)}
        >
          <i className="bi bi-question-circle-fill text-dark opacity-75 hover-opacity-100"></i>
        </button>
      </h2>
      <p className="text-center mb-4">
        In what ways did you operate in the flesh today? Click on each work that was evident in your life.
      </p>
      <div className="table-container">
        <table className="clickable-table">
          <tbody>
            <tr>
              {fleshWorks.slice(0, 3).map(work => (
                <td 
                  key={work.value}
                  data-value={work.value}
                  className={selectedFlesh.includes(work.value) ? 'selected flesh' : ''}
                  onClick={() => onFleshToggle(work.value)}
                >
                  {work.label}
                </td>
              ))}
            </tr>
            <tr>
              {fleshWorks.slice(3, 6).map(work => (
                <td 
                  key={work.value}
                  data-value={work.value}
                  className={selectedFlesh.includes(work.value) ? 'selected flesh' : ''}
                  onClick={() => onFleshToggle(work.value)}
                >
                  {work.label}
                </td>
              ))}
            </tr>
            <tr>
              {fleshWorks.slice(6, 9).map(work => (
                <td 
                  key={work.value}
                  data-value={work.value}
                  className={selectedFlesh.includes(work.value) ? 'selected flesh' : ''}
                  onClick={() => onFleshToggle(work.value)}
                >
                  {work.label}
                </td>
              ))}
            </tr>
            <tr>
              {fleshWorks.slice(9, 12).map(work => (
                <td 
                  key={work.value}
                  data-value={work.value}
                  className={selectedFlesh.includes(work.value) ? 'selected flesh' : ''}
                  onClick={() => onFleshToggle(work.value)}
                >
                  {work.label}
                </td>
              ))}
            </tr>
            <tr>
              {fleshWorks.slice(12, 15).map(work => (
                <td 
                  key={work.value}
                  data-value={work.value}
                  className={selectedFlesh.includes(work.value) ? 'selected flesh' : ''}
                  onClick={() => onFleshToggle(work.value)}
                >
                  {work.label}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      <FleshDefinitionsModal 
        show={showDefinitionsModal}
        onHide={() => setShowDefinitionsModal(false)}
      />
    </div>
  );
};

export default FleshSection; 