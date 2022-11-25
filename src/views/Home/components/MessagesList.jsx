import Message from "./Message";
import "../../../assets/styles/Messages.css";

const MessagesList = ({ messages }) => {

  return (
    <section className="messages" id="messages-container">
      {messages && (
        <ul id="messages-list">
          {messages.map((message, index) => {
            if (message.type === "JOIN") {
              return (
                <div key={index} className="new-user-container">
                  <span>{message.username} has joined the room</span>
                </div>
              );
            }
            return <Message message={message} key={index} />;
          })}
        </ul>
      )}
    </section>
  );
};

export default MessagesList;
