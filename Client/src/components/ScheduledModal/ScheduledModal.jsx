import { Modal } from "@mantine/core";
import moment from "moment-timezone";
import { useState } from "react";
import "./ScheduledModal.css";
import PostShare from "../PostShare/PostShare";

const ScheduledModal = ({ openSchedule, closeSchedule }) => {
  //converting default time to indian standerd time
  const currentDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm");
  const [scheduledDate, setScheduledDate] = useState(currentDate);
  return (
    <Modal
      opened={openSchedule}
      onClose={closeSchedule}
      title="Schedule your post"
      overflow="inside"
      styles={(theme) => ({
        title: {
          fontWeight: "700",
        },
        inner: {
          width: "100%",
        },
      })}
    >
      <div className="schedule">
        <p>Select a date and time in the future for your post to be published</p>
        {/* checking whether the component inside schedule modal */}
        <PostShare
          isScheduling={true}
          scheduledDate={scheduledDate}
          closeSchedule={closeSchedule}
        />
        <input
          type="datetime-local"
          value={scheduledDate}
          min={currentDate}
          onChange={(e) => setScheduledDate(e.target.value)}
        />
        <div className="schedule-buttons">
          <button onClick={closeSchedule}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default ScheduledModal;
