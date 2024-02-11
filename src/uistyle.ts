export const STYLE = `\
.tari-hidden {\
  display: none !important;\
}\
.tari {\
  position: fixed;\
  left: 0;\
  top: 0;\
  right: 0;\
  bottom: 0;\
  z-index: 99999;\
  backdrop-filter: brightness(50%);\
  display: flex;\
  justify-content: center;\
  align-items: start;\
  padding-top: 5%;\
  font-family: monospace;\
}\
.tari-search {\
  min-width: 300px;\
  background-color: #ffffff;\
  padding: 0.5rem;\
  border-radius: 1rem;\
  transition: 0.2s;\
}\
.tari-input {\
  outline: none;\
  border: 1px solid #e0e0e0;\
  background-color: #f0f0f0;\
  border-radius: 0.7rem;\
  padding: 0.8rem 1rem;\
  padding-bottom: calc(0.8rem - 1px);\
  width: calc(100% - 2.1rem);\
  font-family: monospace;\
}\
.tari-highlight {\
  color: #ff7070;\
  font-weight: 700;\
}\
.tari-tips {\
  padding: 0 1rem;\
}\
.tari-list {\
  list-style: none;\
  margin: 0;\
  padding: 0;\
}\
.tari-item, .tari-error {\
  margin-top: 1rem;\
  margin-bottom: 0.5rem;\
}\
.tari-tip {\
}\
.tari-comment {\
  color: #777777;\
}\
.tari-text-btn:hover {\
  cursor: pointer;\
}\
.tari-tip-btn {\
  display: flex;\
  justify-content: space-between;\
}\
.tari-key {\
  border: 1px solid #e0e0e0;\
  background-color: #f0f0f0;\
  border-radius: 0.3rem;\
  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\
  margin: 0 0.2rem;\
  color: #444444;\
}\
.tari-shortcut {\
  color: #7f7f7f;\
  margin-right: 0.8rem;\
}\
.tari-shortcut-preview {\
  display: flex;\
  justify-content: space-between;\
}\
.tari-shortcut-name {\
  margin-left: 1rem;\
  margin-right: 1rem;\
}\
`
