import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const InstallPWAModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Install Spiritual Growth Tracker</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="mb-3">Install this app on your device for quick and easy access:</h6>
        
        <div className="mb-4">
          <h6><i className="bi bi-apple"></i> iOS (iPhone/iPad)</h6>
          <ol>
            <li>Open this website in Safari</li>
            <li>Tap the Share button <i className="bi bi-share"></i> at the bottom of the screen</li>
            <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
            <li>Tap &quot;Add&quot; in the top right corner</li>
          </ol>
        </div>

        <div className="mb-4">
          <h6><i className="bi bi-phone"></i> Android</h6>
          <ol>
            <li>Open this website in Chrome</li>
            <li>Tap the menu button <i className="bi bi-three-dots-vertical"></i> in the top right</li>
            <li>Tap &quot;Add to Home screen&quot; or &quot;Install app&quot;</li>
            <li>Follow the prompts to complete installation</li>
          </ol>
        </div>

        <div className="mb-4">
          <h6><i className="bi bi-windows"></i> Windows</h6>
          <ol>
            <li>Open this website in Microsoft Edge</li>
            <li>Click the menu button <i className="bi bi-three-dots-vertical"></i> in the top right</li>
            <li>Click &quot;Apps&quot; and then &quot;Install this site as an app&quot;</li>
            <li>Click &quot;Install&quot; in the prompt that appears</li>
          </ol>
        </div>

        <div className="alert alert-info">
          <i className="bi bi-info-circle"></i> Once installed, you can access the app directly from your home screen or app drawer, just like a native app!
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

export default InstallPWAModal; 