import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const Modal = ({ isShowing, hide, title, message, callback }) =>
  isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div className="modal-wrapper">
            <div className="modal">
              <div className="modal-header">{title}</div>
              <p className="message"> {message} </p>
              <div className="cancel-confirm-container">
                <button className="cancel-button" onClick={hide}>
                  Annulla
                </button>
                <button
                  className="confirm-button"
                  onClick={() => {
                    callback();
                    hide();
                  }}
                >
                  Conferma
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;

export default Modal;
