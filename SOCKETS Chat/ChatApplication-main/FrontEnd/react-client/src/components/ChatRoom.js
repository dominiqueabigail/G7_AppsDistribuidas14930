import React, { useEffect, useRef, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";

var stompClient = null;

const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  });
  const [newMessageNotification, setNewMessageNotification] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(new Map());
  const [notification, setNotification] = useState(""); // Estado para la notificación flotante

  // Ref para el contenedor de mensajes
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (newMessageNotification) {
      const timer = setTimeout(() => {
        setNewMessageNotification("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [newMessageNotification]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [publicChats, privateChats, tab]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "MESSAGE":
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        setNewMessageNotification(
          `Nuevo mensaje en el Chat de amix de parte de ${payloadData.senderName}`
        );
        setUnreadMessages((prev) => {
          const updated = new Map(prev);
          const count = updated.get("CHATROOM") || 0;
          updated.set("CHATROOM", count + 1);
          return updated;
        });
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
    setNewMessageNotification(
      `Tienes un nuevo mensaje de ${payloadData.senderName}`
    );
    setUnreadMessages((prev) => {
      const updated = new Map(prev);
      const count = updated.get(payloadData.senderName) || 0;
      updated.set(payloadData.senderName, count + 1);
      return updated;
    });
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Validamos el campo de mensaje solo si el usuario está conectado
      if (userData.connected && userData.message.trim() === "") {
        return; // No hacer nada si el campo de mensaje está vacío
      }
      if (tab === "CHATROOM") {
        sendValue();
      } else {
        sendPrivateValue();
      }
    }
  };

  const sendValue = () => {
    if (stompClient && userData.message.trim() !== "") {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const sendPrivateValue = () => {
    if (stompClient && userData.message.trim() !== "") {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
      };
      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    if (userData.username.trim() === "") {
      setNotification("El nombre de usuario no puede estar vacío.");
      setTimeout(() => setNotification(""), 2000); // Limpia la notificación después de 2 segundos
      return; // No conectar si el nombre de usuario está vacío
    }
    connect();
  };

  const handleTabClick = (name) => {
    setTab(name);
    setUnreadMessages((prev) => {
      const updated = new Map(prev);
      updated.delete(name);
      return updated;
    });
  };

  return (
    <div className="container">
      {newMessageNotification && (
        <div className="notification">{newMessageNotification}</div>
      )}
      {notification && (
        <div className="floating-notification">{notification}</div>
      )}
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li
                onClick={() => handleTabClick("CHATROOM")}
                className={`member ${tab === "CHATROOM" && "active"} ${
                  unreadMessages.has("CHATROOM") && "unread"
                }`}
              >
                Chat de amix{" "}
                {unreadMessages.has("CHATROOM") && (
                  <span className="message-count">
                    {unreadMessages.get("CHATROOM")}
                  </span>
                )}
              </li>
              {[...privateChats.keys()].map((name, index) => (
                <li
                  onClick={() => handleTabClick(name)}
                  className={`member ${tab === name && "active"} ${
                    unreadMessages.has(name) && "unread"
                  }`}
                  key={index}
                >
                  {name}{" "}
                  {unreadMessages.has(name) && (
                    <span className="message-count">
                      {unreadMessages.get(name)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {tab === "CHATROOM" && (
            <div className="chat-content">
              <ul className="chat-messages">
                {publicChats.map((chat, index) => (
                  <li
                    className={`message ${
                      chat.senderName === userData.username ? "self" : "other"
                    }`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar">{chat.senderName}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self">{chat.senderName}</div>
                    )}
                  </li>
                ))}
                <div ref={messagesEndRef} />
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="Enter your message"
                  value={userData.message}
                  onChange={handleMessage}
                  onKeyDown={handleKeyDown} // Maneja la tecla Enter
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendValue}
                >
                  Send
                </button>
              </div>
            </div>
          )}
          {tab !== "CHATROOM" && (
            <div className="chat-content">
              <ul className="chat-messages">
                {[...privateChats.get(tab)].map((chat, index) => (
                  <li
                    className={`message ${
                      chat.senderName === userData.username ? "self" : "other"
                    }`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar">{chat.senderName}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self">{chat.senderName}</div>
                    )}
                  </li>
                ))}
                <div ref={messagesEndRef} />
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="Enter your message"
                  value={userData.message}
                  onChange={handleMessage}
                  onKeyDown={handleKeyDown} // Maneja la tecla Enter
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendPrivateValue}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="register">
          <p className="welcome-message">Bienvenido, pon tu nombre:</p>
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
            onKeyDown={(e) => e.key === "Enter" && registerUser()} // Maneja la tecla Enter
          />
          <button type="button" onClick={registerUser}>
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
