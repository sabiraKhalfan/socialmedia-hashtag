import "./ChatBox.css";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getUserDetails } from "../../api/UserRequest";
import Messages from "../Messages/Messages";
import { addNewMessage, getMessages } from "../../api/MessageRequest";
import InputEmoji from "react-input-emoji";
const serverImages = process.env.REACT_APP_PUBLIC_IMAGES;
const serverStatic = process.env.REACT_APP_STATIC_FOLDER;

const ChatBox = ({ room, receiveMessage, setSendMessage }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [memberData, setMemberData] = useState(null);
  const memberId = room?.members?.find((id) => id !== user._id);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(room._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (room) fetchMessages();
  }, [room]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await getUserDetails(memberId);
        setMemberData(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (room) getUserData();
  }, [room, user]);

  useEffect(() => {
    console.log("receiveMessage", receiveMessage);
    if (receiveMessage && receiveMessage.chatId === room._id) {
      setMessages((prevMessages) => {
        return [...prevMessages, receiveMessage];
      });
    }
  }, [receiveMessage]);

  const handleNewMessage = (value) => {
    setNewMessage(value);
  };

  const handleSend = async () => {
    if (newMessage.trim().length === 0) return;
    const message = {
      text: newMessage,
      chatId: room._id,
      senderId: user._id,
    };

    //sending message to server
    try {
      const { data } = await addNewMessage(message);
      setMessages((prevMessages) => {
        return [...prevMessages, data];
      });
      setNewMessage("");
      //send message to socket server
      const receiverId = memberId;
      setSendMessage({ ...data, receiverId });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="chatBox-container">
      {room ? (
        <>
          <div className="chat-header">
            <div className="followers">
              <div>
                <img
                  className="followerImg"
                  src={
                    memberData?.profilePicture
                      ? `${serverImages}/${memberData?.profilePicture}`
                      : `${serverStatic}/profile.jpg`
                  }
                  alt=""
                />
                <div className="name">
                  <span>
                    {memberData?.firstName} {memberData?.lastName}
                  </span>
                </div>
              </div>
            </div>
            <hr style={{ width: " 85%", border: "0.1px solid #ece8e8e1" }} />
          </div>

          {/* messages */}
          <Messages messages={messages} currentUserId={user?._id} />

          {/* chat input */}
          <div className="chat-sender">
            <div>+</div>
            <InputEmoji
              value={newMessage}
              onEnter={handleSend}
              placeholder="Type a message"
              onChange={handleNewMessage}
            />
            <div className="send-button button" onClick={handleSend}>
              Send
            </div>
          </div>
        </>
      ) : (
        <span className="chatbox-empty-message">
          Tap on chat to start a conversation...
        </span>
      )}
    </div>
  );
};

export default ChatBox;
