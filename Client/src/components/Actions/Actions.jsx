import React from "react";
import {
  UilEditAlt,
  UilTrashAlt,
  UilExclamationOctagon,
} from "@iconscout/react-unicons";
import "./Actions.css";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../../actions/PostAction";
const Actions = React.forwardRef(
  ({ postId, userId, openReportModal, onEdit }, ref) => {
    const currentUserId = useSelector(
      (state) => state.authReducer.authData.user._id
    );
    const dispatch = useDispatch();
    const handleDelete = () => {
      const confirm = window.confirm("Are you sure you ?");
      console.log(confirm);
      if (!confirm) return;
      dispatch(deletePost(postId));
    };

    return (
      <div ref={ref} className="actions">
        <ul>
          {currentUserId === userId && (
            <li onClick={onEdit}>
              <UilEditAlt /> Edit
            </li>
          )}
          {currentUserId === userId && (
            <li onClick={handleDelete}>
              <UilTrashAlt /> Delete
            </li>
          )}
          {
          currentUserId !== userId && <li onClick={openReportModal}>
            <UilExclamationOctagon />
            Report
          </li>
          }
        </ul>
      </div>
    );
  }
);

export default Actions;
