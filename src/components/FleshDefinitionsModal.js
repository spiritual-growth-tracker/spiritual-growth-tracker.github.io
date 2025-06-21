import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const FleshDefinitionsModal = ({ show, onHide }) => {
  const definitions = [
    {
      title: 'Sexual Immorality (πορνεία - porneia)',
      definition: 'Any form of sexual activity outside of God\'s design for marriage between one man and one woman.',
      verse: '"Flee from sexual immorality. All other sins a person commits are outside the body, but whoever sins sexually, sins against their own body." - 1 Corinthians 6:18'
    },
    {
      title: 'Impurity (ἀκαθαρσία - akatharsia)',
      definition: 'Moral uncleanness and corruption that affects thoughts, words, and actions.',
      verse: '"But among you there must not be even a hint of sexual immorality, or of any kind of impurity." - Ephesians 5:3'
    },
    {
      title: 'Sensuality (ἀσέλγεια - aselgeia)',
      definition: 'Unrestrained indulgence in physical pleasures and lustful desires.',
      verse: '"They have eyes full of adultery, insatiable for sin. They entice unsteady souls. They have hearts trained in greed." - 2 Peter 2:14'
    },
    {
      title: 'Idolatry (εἰδωλολατρία - eidololatria)',
      definition: 'Worshiping or giving ultimate value to anything other than God.',
      verse: '"Therefore, my dear friends, flee from idolatry." - 1 Corinthians 10:14'
    },
    {
      title: 'Sorcery (φαρμακεία - pharmakeia)',
      definition: 'The use of drugs, magic, or occult practices to manipulate spiritual forces.',
      verse: '"The acts of the flesh are obvious: sexual immorality, impurity and debauchery; idolatry and witchcraft." - Galatians 5:19-20'
    },
    {
      title: 'Enmity (ἔχθρα - echthra)',
      definition: 'Hostility and hatred toward others, often leading to conflict and division.',
      verse: '"For the mind set on the flesh is hostile to God." - Romans 8:7'
    },
    {
      title: 'Strife (ἔρις - eris)',
      definition: 'Quarreling, contention, and rivalry that disrupts relationships and unity.',
      verse: '"For where you have envy and selfish ambition, there you find disorder and every evil practice." - James 3:16'
    },
    {
      title: 'Jealousy (ζῆλος - zelos)',
      definition: 'Resentment and envy of others\' possessions, qualities, or achievements.',
      verse: '"For where you have envy and selfish ambition, there you find disorder and every evil practice." - James 3:16'
    },
    {
      title: 'Fits of Anger (θυμός - thumos)',
      definition: 'Sudden, intense outbursts of rage and wrath that harm relationships.',
      verse: '"Refrain from anger and turn from wrath; do not fret—it leads only to evil." - Psalm 37:8'
    },
    {
      title: 'Rivalries (ἐριθεία - eritheia)',
      definition: 'Selfish ambition and competition that puts personal interests above others.',
      verse: '"Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves." - Philippians 2:3'
    },
    {
      title: 'Dissensions (διχοστασία - dichostasia)',
      definition: 'Disagreements and divisions that create factions and break unity.',
      verse: '"I appeal to you, brothers and sisters, in the name of our Lord Jesus Christ, that all of you agree with one another in what you say and that there be no divisions among you." - 1 Corinthians 1:10'
    },
    {
      title: 'Divisions (αἵρεσις - hairesis)',
      definition: 'Forming exclusive groups or sects that cause separation and disunity.',
      verse: '"I urge you, brothers and sisters, to watch out for those who cause divisions and put obstacles in your way." - Romans 16:17'
    },
    {
      title: 'Envy (φθόνος - phthonos)',
      definition: 'Resentment and discontent over others\' blessings or success.',
      verse: '"A heart at peace gives life to the body, but envy rots the bones." - Proverbs 14:30'
    },
    {
      title: 'Drunkenness (μέθη - methe)',
      definition: 'Excessive consumption of alcohol leading to impaired judgment and behavior.',
      verse: '"Do not get drunk on wine, which leads to debauchery. Instead, be filled with the Spirit." - Ephesians 5:18'
    },
    {
      title: 'Orgies (κῶμος - komos)',
      definition: 'Wild, excessive partying and revelry that leads to immoral behavior.',
      verse: '"Let us behave decently, as in the daytime, not in carousing and drunkenness, not in sexual immorality and debauchery." - Romans 13:13'
    }
  ];

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Biblical Definitions of the Works of the Flesh</Modal.Title>
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

export default FleshDefinitionsModal; 