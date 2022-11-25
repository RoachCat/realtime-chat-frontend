import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import UserRegistration from "./components/UserRegistration.jsx";
import MessagesList from "./components/MessagesList.jsx";
import MessageInput from "./components/MessageInput.jsx";
import Channels from "./components/Rooms.jsx";
import "../../assets/styles/Home.css";

export const SocketContext = React.createContext();

const Home = () => {
  const [userInformation, setUserInformation] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({});
  const [messagesList, setMessagesList] = useState({});
  const [socket, setSocket] = useState(null);
  // const [userJoinedRoom, setUserJoinedRoom] = useState(null);
  const messagesListRef = useRef({});

  useEffect(() => {
    if (userInformation) {
      console.log(process.env.REACT_APP_BACKEND_SOCKET_URL);
      setSocket(
        io.connect(process.env.REACT_APP_BACKEND_SOCKET_URL, { secure: true })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInformation]);

  useEffect(() => {
    if (socket) {
      initializeApp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  async function initializeApp() {
    const rooms = await getRooms();
    defineMessagesByRoom(rooms);
    joinToRoom(rooms[0]);
    listenToMessages();
    setMessagesListWithRoomHistory(rooms[0]);
  }

  async function setMessagesListWithRoomHistory(defaultRoom) {
    const messagesHistory = await getMessagesHistory(defaultRoom.room_id);
    setMessagesList((prevMessagesList) => ({
      ...prevMessagesList,
      [defaultRoom.room_id]: messagesHistory,
    }));
    messagesListRef.current[defaultRoom.room_id] = messagesHistory;
  }

  async function getRooms() {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/room"
    ).then((response) => response.json());
    setRooms(response);
    return response;
  }

  function defineMessagesByRoom(rooms) {
    const messagesByRoom = {};
    rooms.forEach((room) => {
      messagesByRoom[room.room_id] = [];
    });
    messagesListRef.current = messagesByRoom;
    setMessagesList(messagesByRoom);
  }

  function joinToRoom(room) {
    setCurrentRoom(room);
    const payload = {
      ...userInformation,
      room_id: room.room_id,
      room_name: room.room_name,
    };
    socket.emit("join-room", payload);
  }

  function sendMessage(message) {
    if (message) {
      const payload = {
        ...userInformation,
        message,
        room_id: currentRoom.room_id,
      };
      socket.emit("send-message", payload);
    }
  }

  function listenToMessages() {
    socket.on("get-message", (data) => {
      modifyMessagesList(data);
    });
  }

  function modifyMessagesList(data) {
    const newMessagesList = structuredClone(messagesListRef.current);
    const messageObject = {
      ...data,
      isOwnMessage: data.user_id === userInformation.user_id,
    };
    newMessagesList[data.room_id].push(messageObject);
    messagesListRef.current = newMessagesList;
    setMessagesList(newMessagesList);
  }

  async function getMessagesHistory(roomId) {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL +
        "/room-history?" +
        new URLSearchParams({
          room_id: roomId,
        })
    ).then((response) => response.json());
    return response.history;
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        userInformation,
        messagesList,
        currentRoom,
        sendMessage,
        joinToRoom,
        rooms,
      }}
    >
      <div className="chat-room-container">
        {!rooms.length ? (
          <UserRegistration
            setUserInformation={(data) => setUserInformation(data)}
          />
        ) : (
          <div className="main-content">
            <Channels />
            <div className="chat-room">
              <MessagesList
                // userJoinedRoom={userJoinedRoom}
                messages={messagesList[currentRoom.room_id]}
              />
              <MessageInput />
            </div>
          </div>
        )}
      </div>
    </SocketContext.Provider>
  );
};

export default Home;
