import React, { useEffect, useState } from "react";
import LoadingAnimation from "../global/LoadingAnimation";
import CustomButton from "../global/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { fetchGroupData, removeMemberFromGroup } from "../../services/group.service";
import { GroupData } from "../../models/GroupData.model";
import { getTimePassed } from "../../services/poll.service";
import ContentPageMessage from "../content-page/messege/ContentPageMessage";
import { useGroups } from "../../context/GroupContext";

export default function GroupInfo() {
  // Temporary hard coded user ID
  const userId = import.meta.env.VITE_DEBUG_USER_ID;
  const { groupId } = useParams();
  const { groups, setGroups } = useGroups();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState<GroupData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  // TODO: pull image urls from server
  const profilePictureUrl =
    "https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg";
  const bannerPictureUrl =
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e1fc0f08-7c3c-4224-b34b-1fe510feb6fd/d51vvz0-03d69283-b7d4-495e-82f8-5103f09d2b9a.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2UxZmMwZjA4LTdjM2MtNDIyNC1iMzRiLTFmZTUxMGZlYjZmZFwvZDUxdnZ6MC0wM2Q2OTI4My1iN2Q0LTQ5NWUtODJmOC01MTAzZjA5ZDJiOWEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.G5uPqH18xVbG7tywZNXVjRmX0W1_bfNbi1cvdR6XZXw";

  useEffect(() => {
    if (groupId) {
      setIsLoading(true);
      fetchGroupData(groupId)
        .then((data) => {
          console.log("Fetched group data for group with ID: ", groupId, data);
          setGroupData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("Unable to fetch group data with ID " + groupId);
          setErrorMessage(error);
          setIsLoading(false);
        });
    }
  }, [groupId]);

  const onExitGroupClick = () => {
    if (groupId) {
      removeMemberFromGroup(groupId, userId)
        .then(() => {
          setGroups((prevGroups) => prevGroups?.filter((group) => group.groupId !== groupId));
          navigate("/feed");
        })
        .catch((error) => {
          console.log("Unable to leave group data with ID " + groupId);
          setErrorMessage(String(error));
        });
    }
  };

  const onAddMemberClick = () => {};

  const onDeleteMemberClick = () => {};

  const onDeleteGroupClick = () => {};

  const onModifyRolesClick = () => {};

  if (errorMessage) {
    return <ContentPageMessage msgText={errorMessage} />;
  }

  if (isLoading) {
    return <LoadingAnimation message="Loading group information" dots="off" />;
  }

  if (!groupData) {
    return <ContentPageMessage msgText="Could not fetch group data" />;
  }

  return (
    <div className="group-info">
      <div className="group-info__header">
        <img src={bannerPictureUrl} alt="Banner" className="group-info__banner-img" />
        <div className="group-info__details">
          <img src={profilePictureUrl} alt="Profile" className="group-info__profile-picture" />
          <div className="group-info__title">
            <h1 className="group-info__group-name">{groupData?.groupName}</h1>
          </div>
        </div>
        <hr className="group-info__divider" />
      </div>
      <div className="group-info__commands-bar">
        <CustomButton onClick={onExitGroupClick} name="exit-group-btn" theme="dark">
          Exit Group
        </CustomButton>
        <CustomButton onClick={onAddMemberClick} name="add-member-btn" theme="dark">
          Add Member
        </CustomButton>
        <CustomButton onClick={onDeleteMemberClick} name="delete-member-btn" theme="dark">
          Delete Member
        </CustomButton>
        <CustomButton onClick={onDeleteGroupClick} name="delete-group-btn" theme="dark">
          Delete Group
        </CustomButton>
        <CustomButton onClick={onModifyRolesClick} name="modify-roles-btn" theme="dark">
          Modify Roles
        </CustomButton>
      </div>
      <div className="group-info__info-container">
        <div className="group-info__description">
          <h3>Description:</h3>
          <br />
          {groupData?.description}
        </div>
        <div className="group-info__group-info">
          <h3>Info:</h3>
          <br />
          <h4 className="group-info__group-info__label">Created:</h4>
          {getTimePassed(groupData?.timeCreated ?? "")} <br /> <br />
          <h4 className="group-info__group-info__label">Group ID:</h4> {groupData?.groupId}
        </div>
      </div>
    </div>
  );
}
