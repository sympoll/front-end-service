import React, { useEffect, useState } from "react";
import LoadingAnimation from "../global/LoadingAnimation";
import CustomButton from "../global/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteGroupById,
  fetchGroupData,
  removeMemberFromGroup
} from "../../services/group.service";
import { GroupData } from "../../models/GroupData.model";
import { getTimePassed } from "../../services/poll.service";
import ContentPageMessage from "../content-page/messege/ContentPageMessage";
import { useGroups } from "../../context/GroupsContext";
import AddMemberPopup from "../popup/AddMemberPopup";
import RemoveMemberPopup from "../popup/RemoveMemberPopup";
import ModifyRolesPopup from "../popup/ModifyRolesPopup";
import { useMembers } from "../../context/MemebersContext";
import VerifyPopup from "../popup/VerifyPopup";

export default function GroupInfo() {
  // Temporary hard coded user ID
  const userId = import.meta.env.VITE_DEBUG_USER_ID;
  const { groupId } = useParams();
  const { setGroups } = useGroups();
  const { getMemberRole } = useMembers();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState<GroupData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState<boolean>(false);
  const [isRemoveMemberPopupOpen, setIsRemoveMemberPopupOpen] = useState<boolean>(false);
  const [isModifyRolesPopupOpen, setIsModifyRolesPopupOpen] = useState<boolean>(false);
  const [isExitVerifyPopupOpen, setIsExitVerifyPopupOpen] = useState<boolean>(false);
  const [isDeleteVerifyPopupOpen, setIsDeleteVerifyPopupOpen] = useState<boolean>(false);
  const [isUserHasPermissionToAddMember, setIsUserHasPermissionToAddMember] =
    useState<boolean>(false);
  const [isUserHasPermissionToRmvMember, setIsUserHasPermissionToRmvMember] =
    useState<boolean>(false);
  const [isUserHasPermissionToRmvGroup, setIsUserHasPermissionToRmvGroup] =
    useState<boolean>(false);
  const [isUserHasPermissionToModRoles, setIsUserHasPermissionToModRoles] =
    useState<boolean>(false);
  const [timePassed, setTimePassed] = useState<string>();

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

    fetchUserPermissionsInCommandBar();
  }, [groupId]);

  useEffect(() => {
    if (groupData) {
      const interval = setInterval(() => {
        setTimePassed(getTimePassed(groupData.timeCreated));
      }, 1000); // Update every second

      return () => clearInterval(interval); // Cleanup the interval on component unmount
    }
  }, [groupData?.timeCreated]);

  const fetchUserPermissionsInCommandBar = () => {
    const userRole = getMemberRole(userId);

    if (userRole === "Admin") {
      setIsUserHasPermissionToAddMember(true);
      setIsUserHasPermissionToRmvMember(true);
      setIsUserHasPermissionToRmvGroup(true);
      setIsUserHasPermissionToModRoles(true);
    } else if (userRole === "Moderator") {
      setIsUserHasPermissionToAddMember(true);
      setIsUserHasPermissionToRmvMember(true);
      setIsUserHasPermissionToRmvGroup(false);
      setIsUserHasPermissionToModRoles(false);
    }
  };

  const exitGroup = () => {
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

  const deleteGroup = () => {
    if (groupId) {
      deleteGroupById(groupId)
        .then(() => {
          setGroups((prevGroups) => prevGroups?.filter((group) => group.groupId !== groupId));
          navigate("/feed");
        })
        .catch((error) => {
          console.log("Unable to delete the group with ID " + groupId);
          setErrorMessage(String(error));
        });
    }
  };

  const onExitGroupClick = () => {
    setIsExitVerifyPopupOpen(true);
  };

  const onAddMemberClick = () => {
    setIsAddMemberPopupOpen(true);
  };

  const onRemoveMemberClick = () => {
    setIsRemoveMemberPopupOpen(true);
  };

  const onModifyRolesClick = () => {
    setIsModifyRolesPopupOpen(true);
  };

  const onDeleteGroupClick = () => {
    setIsDeleteVerifyPopupOpen(true);
  };

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
        {isUserHasPermissionToAddMember && (
          <CustomButton onClick={onAddMemberClick} name="add-member-btn" theme="dark">
            Add Member
          </CustomButton>
        )}
        {isUserHasPermissionToRmvMember && (
          <CustomButton onClick={onRemoveMemberClick} name="delete-member-btn" theme="dark">
            Remove Member
          </CustomButton>
        )}
        {isUserHasPermissionToModRoles && (
          <CustomButton onClick={onModifyRolesClick} name="modify-roles-btn" theme="dark">
            Modify Roles
          </CustomButton>
        )}
        {isUserHasPermissionToRmvGroup && (
          <CustomButton onClick={onDeleteGroupClick} name="delete-group-btn" theme="warning">
            Delete Group
          </CustomButton>
        )}
      </div>
      {isExitVerifyPopupOpen && (
        <VerifyPopup
          headlineMessage="leave the group?"
          OnClickYes={exitGroup}
          onClose={() => setIsExitVerifyPopupOpen(false)}
        />
      )}
      {isAddMemberPopupOpen && groupId && (
        <AddMemberPopup groupId={groupId} onClose={() => setIsAddMemberPopupOpen(false)} />
      )}
      {isRemoveMemberPopupOpen && groupId && (
        <RemoveMemberPopup
          groupId={groupId}
          userId={userId}
          onClose={() => setIsRemoveMemberPopupOpen(false)}
        />
      )}
      {isModifyRolesPopupOpen && groupId && (
        <ModifyRolesPopup
          groupId={groupId}
          userId={userId}
          onClose={() => setIsModifyRolesPopupOpen(false)}
        />
      )}
      {isDeleteVerifyPopupOpen && (
        <VerifyPopup
          headlineMessage="delete the group?"
          OnClickYes={deleteGroup}
          onClose={() => setIsDeleteVerifyPopupOpen(false)}
        />
      )}
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
          {timePassed} <br /> <br />
          <h4 className="group-info__group-info__label">Group ID:</h4> {groupData?.groupId}
        </div>
      </div>
    </div>
  );
}
