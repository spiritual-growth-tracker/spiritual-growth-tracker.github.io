import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const FruitsDefinitionsModal = ({ show, onHide }) => {
  const definitions = [
    {
      title: 'Love (ἀγάπη - agape)',
      definition: 'A selfless, sacrificial love that seeks the best for others without expecting anything in return.',
      verse: '"Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs." - 1 Corinthians 13:4-5'
    },
    {
      title: 'Joy (χαρά - chara)',
      definition: 'A deep, abiding sense of gladness and delight that comes from God, independent of circumstances.',
      verse: '"The joy of the Lord is your strength." - Nehemiah 8:10'
    },
    {
      title: 'Peace (εἰρήνη - eirene)',
      definition: 'A state of wholeness, harmony, and tranquility that comes from being in right relationship with God and others.',
      verse: '"Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid." - John 14:27'
    },
    {
      title: 'Patience (μακροθυμία - makrothumia)',
      definition: 'The ability to endure difficult circumstances and people without becoming angry or frustrated.',
      verse: '"Be patient, bearing with one another in love." - Ephesians 4:2'
    },
    {
      title: 'Kindness (χρηστότης - chrestotes)',
      definition: 'A tender, compassionate attitude that leads to helpful actions toward others.',
      verse: '"Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you." - Ephesians 4:32'
    },
    {
      title: 'Goodness (ἀγαθωσύνη - agathosune)',
      definition: 'Moral excellence and virtue that manifests in righteous actions and pure motives.',
      verse: '"Surely your goodness and love will follow me all the days of my life." - Psalm 23:6'
    },
    {
      title: 'Faithfulness (πίστις - pistis)',
      definition: 'Steadfast loyalty, reliability, and trustworthiness in relationships and commitments.',
      verse: '"Let love and faithfulness never leave you; bind them around your neck, write them on the tablet of your heart." - Proverbs 3:3'
    },
    {
      title: 'Gentleness (πραΰτης - prautes)',
      definition: 'Strength under control, characterized by humility, meekness, and consideration for others.',
      verse: '"Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls." - Matthew 11:29'
    },
    {
      title: 'Self-control (ἐγκράτεια - egkrateia)',
      definition: 'The ability to master one\'s desires, emotions, and actions through the power of the Holy Spirit.',
      verse: '"Like a city whose walls are broken through is a person who lacks self-control." - Proverbs 25:28'
    }
  ];

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Biblical Definitions of the Fruits of the Spirit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="list-group">
          {definitions.map((item, index) => (
            <div key={index} className="list-group-item">
              <h6 className="mb-1">{item.title}</h6>
              <p className="mb-2"><strong>Definition:</strong> {item.definition}</p>
              <p className="mb-0">{item.verse}</p>
            </div>
          ))}
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

export default FruitsDefinitionsModal; 