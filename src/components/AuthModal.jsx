import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function AuthModal({ show, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Авторизация</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Пожалуйста, войдите или зарегистрируйтесь перед добавлением груза или машины.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          ОК
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AuthModal;
