import "./ReportModal.css";
import { Modal, createStyles } from "@mantine/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { reportPost } from "../../actions/PostAction";

function ReportModal({ openReportModal, closeReportModal, postId }) {
  const [reportType, setReportType] = useState("");
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setReportType(e.currentTarget.value);
  };

  const handleSubmitReport = () => {
    closeReportModal();
    dispatch(reportPost(postId, reportType));
  };

  return (
    <Modal
      centered
      opened={openReportModal}
      onClose={closeReportModal}
      title="Report post"
      // inline styling
      styles={(theme) => ({
        title: {
          fontWeight: "700",
          marginLeft: "33%",
        },
        inner: {
          width: "100%",
        },
        modal: {
          width: "20rem",
        },
      })}
    >
      <div className="report-post">
        <div className="report-input">
          <input
            type="radio"
            value="spam"
            id="spam"
            name="report"
            defaultChecked={reportType === "spam"}
            onChange={handleChange}
          />
          <div>
            <label htmlFor="spam">Spam</label>
            <p>Misleading or repetitive posts</p>
          </div>
        </div>
        <div className="report-input">
          <input
            type="radio"
            value="nudity"
            id="nudity"
            name="report"
            defaultChecked={reportType === "nudity"}
            onChange={handleChange}
          />
          <div>
            <label htmlFor="nudity">Nudity or pornography</label>
            <p>Sexually explicit content</p>
          </div>
        </div>
        <div className="report-input">
          <input
            type="radio"
            value="hate"
            name="report"
            id="hate"
            defaultChecked={reportType === "hate"}
            onChange={handleChange}
          />
          <div>
            <label htmlFor="hate">Hate speech</label>
            <p>Attack directed at protected group</p>
          </div>
        </div>
        <div className="report-input">
          <input
            type="radio"
            value="selfInjury"
            id="selfInjury"
            name="report"
            defaultChecked={reportType === "selfInjury"}
            onChange={handleChange}
          />
          <div>
            <label htmlFor="selfInjury">Self Injury</label>
            <p>Eating disorder, cutting promoting suicide</p>
          </div>
        </div>
        <div className="report-input">
          <input
            type="radio"
            value="violence"
            id="violence"
            name="report"
            defaultChecked={reportType === "violence"}
            onChange={handleChange}
          />
          <div>
            <label htmlFor="violence">Graphic violence</label>
            <p>Violent images or promotion of violence</p>
          </div>
        </div>
        <div className="report-input">
          <input
            type="radio"
            value="copyright"
            id="copyright"
            name="report"
            defaultChecked={reportType === "copyright"}
            onChange={handleChange}
          />
          <div>
            <label htmlFor="copyright">My intellectual property</label>
            <p>Copyright or trademark infringement</p>
          </div>
        </div>
      </div>
      <div className="report-submit">
        <button onClick={closeReportModal}>Cancel</button>
        <button disabled={!reportType} onClick={handleSubmitReport}>
          Report
        </button>
      </div>
    </Modal>
  );
}

export default ReportModal;
