import { useState, useContext } from "react";
import { SocketContext } from "../Index";

const MessageInput = () => {
  const context = useContext(SocketContext);
  const [messageValue, setMessageValue] = useState("");

  function sendMessageHandler() {
    context.sendMessage(messageValue);
    setMessageValue("");
  }

  return (
    <div className="message-form">
      <input
        type="text"
        className="message-form__input"
        placeholder="Type a message"
        autoFocus
        value={messageValue}
        onChange={(event) => setMessageValue(event.target.value)}
        onKeyDown={(event) =>
          event.key === "Enter" ? sendMessageHandler() : ""
        }
      />
      <button
        className="message-form__button"
        onClick={() => sendMessageHandler()}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
