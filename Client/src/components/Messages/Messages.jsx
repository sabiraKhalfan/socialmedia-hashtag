import moment from "moment";
import React, { useEffect } from "react";
import { useRef } from "react";
const Messages = ({ messages, currentUserId }) => {
  const scroll = useRef();

  //always scroll to last message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="chat-body">
      {messages?.map((message) => {
        return (
          <React.Fragment key={message._id}>
            <div
              ref={scroll}
              className={
                message.senderId === currentUserId ? "message own" : "message"
              }
            >
              <span>{message.text}</span>
              <span>{moment(message.createdAt).fromNow()}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Messages;
