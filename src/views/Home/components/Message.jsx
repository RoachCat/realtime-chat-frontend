import "../../../assets/styles/MessageCard.css";

const Message = ({ message }) => {
  function getTime(date) {
    const newDate = new Date(date);
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    return `${hours}:${minutes}`;
  }

  return (
    <li
      className={
        message.isOwnMessage
          ? "message-card message-card--own"
          : "message-card message-card--other"
      }
    >
      <span className="message-card__sender">
        {message.isOwnMessage ? "Me" : message.username}:&nbsp;
      </span>
      <span>{message.message}</span>
      <span className="message-card__time">{getTime(message.date)}</span>
    </li>
  );
};

export default Message;
