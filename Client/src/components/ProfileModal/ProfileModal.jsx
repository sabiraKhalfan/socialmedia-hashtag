import { Modal, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../actions/UserAction";
import "./ProfileModal.css"

const ProfileModal = ({ opened, onClose, handleClose }) => {
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const [userData, setUserData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    about: user.about || "",
    relationship: user.relationship || "",
    livesIn: user.livesIn || "",
    worksAt: user.worksAt || "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateProfile(user._id, userData));
    handleClose();
  };
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="40%"
    >
      <form className="infoForm" onSubmit={handleSubmit}>
        <h3>Your Info</h3>
        <div>
          <input
            type="text"
            className="infoInput"
            name="firstName"
            onChange={handleChange}
            value={userData.firstName}
            placeholder="First Name"
          />
          <input
            type="text"
            className="infoInput"
            name="lastName"
            onChange={handleChange}
            value={userData.lastName}
            placeholder="Last Name"
          />
        </div>
        <div>
          <input
            type="text"
            className="infoInput"
            name="about"
            onChange={handleChange}
            value={userData.about}
            placeholder="About"
          />
        </div>
        <div>
          <input
            type="text"
            className="infoInput"
            name="livesIn"
            onChange={handleChange}
            value={userData.livesIn}
            placeholder="Lives In"
          />
          <input
            type="text"
            className="infoInput"
            name="worksAt"
            onChange={handleChange}
            value={userData.worksAt}
            placeholder="Works At"
          />
        </div>
        <div>
          <input
            type="text"
            className="infoInput"
            name="relationship"
            onChange={handleChange}
            value={userData.relationship}
            placeholder="Relationship Status"
          />
        </div>
        <button className="button info-button">Update</button>
      </form>
    </Modal>
  );
};

export default ProfileModal;
