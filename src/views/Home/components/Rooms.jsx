import { useContext } from "react";
import { SocketContext } from "../Index";
import "../../../assets/styles/Rooms.css";

const Rooms = () => {
  const context = useContext(SocketContext);

  function joinToRoom(data) {
    if (context.currentRoom.room_id !== data.room_id) {
      context.joinToRoom(data);
    }
  }

  function toggleMenu() {
    const menu = document.getElementById("rooms-list-container");
    if (!menu.style.display || menu.style.display === "none") {
      menu.style.display = "block";
    } else {
      menu.style.display = "none";
    }
  }

  return (
    <div className="rooms">
      <div className="collapse-container">
        <button
          className="collapse-container__button"
          onClick={() => toggleMenu()}
        >
          <div></div>
          <div></div>
          <div></div>
        </button>
      </div>
      <div className="rooms-list-container" id="rooms-list-container">
        <div className="title-container">
          <h2>Rooms</h2>
        </div>
        <ul className="rooms-list">
          {context.rooms.map((room, index) => (
            <li
              key={index}
              className={[
                "rooms-list__item",
                context.currentRoom.room_id === room.room_id
                  ? "rooms-list__item--active"
                  : "",
              ].join(" ")}
              onClick={() => joinToRoom(room)}
            >
              <div className="room-name">{room.room_name}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Rooms;
