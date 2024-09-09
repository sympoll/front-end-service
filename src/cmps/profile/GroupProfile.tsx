import React, { ChangeEvent, useEffect, useState } from "react";
import LoadingAnimation from "../global/LoadingAnimation";
import CustomButton from "../global/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteGroupById,
  fetchGroupData,
  removeMemberFromGroup,
  saveGroupDescription
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
import { UserRoleName } from "../../models/enum/UserRoleName.enum";
import { fetchUserData } from "../../services/user.profile.service";
import defaultProfilePictureUrl from "/imgs/profile/blank-group-profile-picture.jpg";
import defaultProfileBannerUrl from "/imgs/profile/blank-profile-banner.jpg";
import { fetchPicture, uploadGroupProfileImage } from "../../services/media.service";
import { useUser } from "../../context/UserContext";
import EditDescriptionIcon from "@mui/icons-material/MoreVert";

export default function GroupInfo() {
  const navigate = useNavigate();

  const { groupId } = useParams();
  const { setGroups } = useGroups();
  const { members, getMemberRole } = useMembers();
  const [groupData, setGroupData] = useState<GroupData>();
  const { user } = useUser();
  const userId = user?.userId;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState<boolean>(false);
  const [isRemoveMemberPopupOpen, setIsRemoveMemberPopupOpen] = useState<boolean>(false);
  const [isModifyRolesPopupOpen, setIsModifyRolesPopupOpen] = useState<boolean>(false);
  const [isExitVerifyPopupOpen, setIsExitVerifyPopupOpen] = useState<boolean>(false);
  const [isDeleteVerifyPopupOpen, setIsDeleteVerifyPopupOpen] = useState<boolean>(false);

  const [isProfilePictureMenuVisible, setIsProfilePictureMenuVisible] = useState<boolean>(false);
  const [isProfileBannerMenuVisible, setIsProfileBannerMenuVisible] = useState<boolean>(false);
  const [isEditDescriptionMenuVisible, setIsEditDescriptionMenuVisible] = useState<boolean>(false);

  const [canSetPictures, setCanSetPictures] = useState(false);
  const [profileImageSrc, setProfileImageSrc] = useState<string>(defaultProfilePictureUrl);
  const [bannerImageSrc, setBannerImageSrc] = useState<string>(defaultProfileBannerUrl);

  const [isUserHasPermissionToAddMember, setIsUserHasPermissionToAddMember] =
    useState<boolean>(false);
  const [isUserHasPermissionToRmvMember, setIsUserHasPermissionToRmvMember] =
    useState<boolean>(false);
  const [isUserHasPermissionToRmvGroup, setIsUserHasPermissionToRmvGroup] =
    useState<boolean>(false);
  const [isUserHasPermissionToModRoles, setIsUserHasPermissionToModRoles] =
    useState<boolean>(false);
  const [isUserHasPermissionToEditDescription, setIsUserHasPermissionToEditDescription] =
    useState<boolean>(false);

  const [timePassed, setTimePassed] = useState<string>();
  const userData = fetchUserData(userId);
  const [descriptionText, setDescriptionText] = useState<string>("");
  const defaultDescription = "It looks like this group hasn’t set a description yet.";
  const resetUserDescriptionText = () =>
    setDescriptionText(
      groupData ? groupData.description || defaultDescription : defaultDescription
    );
  const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);

  // Styling configurations:
  const commandBarButtonsWidth = "100px";
  const normalTheme = "dark";
  const warningTheme = "warning";
  const memberButtonsColor = "#5555c2";
  const roleButtonsColor = "#148c14";

  useEffect(() => {
    if (groupId) {
      setIsLoading(true);
      fetchGroupData(groupId)
        .then((data) => {
          console.log("Fetched group data for group with ID: ", groupId, data);
          setGroupData(data);
          setDescriptionText(data.description || defaultDescription);
          setCanSetPictures(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("Unable to fetch group data with ID " + groupId);
          setErrorMessage(error);
          setIsLoading(false);
        });
    }
  }, [groupId]);

  useEffect(() => {
    if (groupData) {
      const interval = setInterval(() => {
        setTimePassed(getTimePassed(groupData.timeCreated));
      }, 1000); // Update every second

      return () => clearInterval(interval); // Cleanup the interval on component unmount
    }
  }, [groupData?.timeCreated]);

  useEffect(() => {
    fetchUserPermissionsInCommandBar();
  }, [members]);

  useEffect(() => {
    if (canSetPictures) {
      fetchPicture(groupData?.profilePictureUrl)
        .then((data) => {
          console.log("Fetched group's profile picture");
          setProfileImageSrc(data ?? defaultProfilePictureUrl);
        })
        .catch((error) => {
          console.log("Unable to fetch group's profile picture");
        });

      fetchPicture(groupData?.profileBannerUrl)
        .then((data) => {
          console.log("Fetched group's bannner picture");
          setBannerImageSrc(data ?? defaultProfileBannerUrl);
        })
        .catch((error) => {
          console.log("Unable to fetch group's banner picture");
        });

      setCanSetPictures(false);
    }
  }, [canSetPictures]);

  const fetchUserPermissionsInCommandBar = () => {
    console.log("Fetching user permissions in group");
    const userRole = getMemberRole(userId);

    if (userRole === UserRoleName.ADMIN) {
      setIsUserHasPermissionToAddMember(true);
      setIsUserHasPermissionToRmvMember(true);
      setIsUserHasPermissionToRmvGroup(true);
      setIsUserHasPermissionToModRoles(true);
      setIsUserHasPermissionToEditDescription(true);
    } else if (userRole === UserRoleName.MODERATOR) {
      setIsUserHasPermissionToAddMember(true);
      setIsUserHasPermissionToRmvMember(true);
      setIsUserHasPermissionToRmvGroup(false);
      setIsUserHasPermissionToModRoles(false);
      setIsUserHasPermissionToEditDescription(false);
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

  const handleProfileImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log("Group profile picture was added, uploading...");
    const file = event.target.files?.[0];

    if (file && groupId) {
      const targetId = event.target.id;

      if (targetId === "profile-picture-upload-input") {
        console.log("Profile picture input was clicked");

        try {
          console.log("uploading file: " + file?.name);
          const response = await uploadGroupProfileImage(groupId, file, "profile picture");

          // Update the local group data to include the newly uploaded profile picture
          setGroupData(
            (prevGroupData) =>
              prevGroupData && { ...prevGroupData, profilePictureUrl: response.imageUrl }
          );
          setCanSetPictures(true);
        } catch (error) {
          console.error("Failed to upload group profile picture: ", error);
        }
      } else if (targetId === "profile-banner-upload-input") {
        console.log("Group profile banner input was clicked");

        try {
          console.log("uploading file: " + file?.name);
          const response = await uploadGroupProfileImage(groupId, file, "profile banner");

          // Update the local user data to include the newly uploaded profile banner
          setGroupData(
            (prevGroupData) =>
              prevGroupData && { ...prevGroupData, profileBannerUrl: response.imageUrl }
          );
          setCanSetPictures(true);
        } catch (error) {
          console.error("Failed to upload group profile banner: ", error);
        }
      } else {
        console.error("Unknown input");
      }
    }
  };

  const onEditDescription = () => {
    toggleEditDescriptionMenu();

    // Check if clicked on edit button or exit button
    if (isEditingDescription) {
      setIsEditingDescription(false);
      resetUserDescriptionText();
    } else {
      setIsEditingDescription(true);
    }
  };

  const onSaveDescription = () => {
    if (!groupId) {
      throw new Error("Error fetching group ID param");
    }

    saveGroupDescription(groupId, descriptionText)
      .then((data) => {
        console.log("Saved group description for group with ID: ", groupId, data);
        setDescriptionText(descriptionText);
        setGroupData(
          (prevGroupData) => prevGroupData && { ...prevGroupData, description: descriptionText }
        );
        setIsEditingDescription(false);
      })
      .catch((error) => {
        console.log("Unable to save group description for group with ID " + groupId);
        setErrorMessage("Unable to save group description for group with ID " + groupId);
        resetUserDescriptionText();
        setIsEditingDescription(false);
      });
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionText(event.target.value);
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

  const toggleProfilePictureMenu = () => {
    setIsProfilePictureMenuVisible(!isProfilePictureMenuVisible);
  };

  const toggleProfileBannerMenu = () => {
    setIsProfileBannerMenuVisible(!isProfileBannerMenuVisible);
  };

  const toggleEditDescriptionMenu = () => {
    setIsEditDescriptionMenuVisible(!isEditDescriptionMenuVisible);
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

  if (!userData) {
    return <ContentPageMessage msgText="Could not fetch user data" />;
  }

  return (
    <div className="group-info">
      <div className="group-info__header">
        <div
          className="group-info__profile-banner-container"
          onClick={
            getMemberRole(userId) === UserRoleName.ADMIN ? toggleProfileBannerMenu : undefined
          }
          style={
            getMemberRole(userId) === UserRoleName.ADMIN
              ? { cursor: "pointer" }
              : { cursor: "default" }
          }
        >
          <div>
            <img src={bannerImageSrc} alt="Banner" className="group-info__banner-img" />
          </div>
          {isProfileBannerMenuVisible && (
            <div className="group-info__profile-banner-menu">
              <button
                onClick={() => document.getElementById("profile-banner-upload-input")?.click()}
              >
                Upload Group Banner
              </button>
            </div>
          )}
          <input
            id="profile-banner-upload-input"
            type="file"
            accept="image/*"
            title=""
            className="group-info__upload-profile-banner-input"
            onChange={handleProfileImageUpload}
          />
        </div>
        <div className="group-info__details">
          <div
            className="group-info__profile-picture-container"
            onClick={
              getMemberRole(userId) === UserRoleName.ADMIN ? toggleProfilePictureMenu : undefined
            }
            style={
              getMemberRole(userId) === UserRoleName.ADMIN
                ? { cursor: "pointer" }
                : { cursor: "default" }
            }
          >
            <div>
              <img src={profileImageSrc} alt="Profile" className="group-info__profile-img" />
            </div>
            {isProfilePictureMenuVisible && (
              <div className="group-info__profile-picture-menu">
                <button
                  onClick={() => document.getElementById("profile-picture-upload-input")?.click()}
                >
                  Upload Group Profile Picture
                </button>
              </div>
            )}
            <input
              id="profile-picture-upload-input"
              type="file"
              accept="image/*"
              title=""
              className="group-info__upload-profile-picture-input"
              onChange={handleProfileImageUpload}
            />
          </div>
          <div className="group-info__title">
            <h1 className="group-info__group-name">{groupData.groupName}</h1>
          </div>
        </div>
        <hr className="group-info__divider" />
      </div>
      <div className="group-info__commands-bar">
        {isUserHasPermissionToAddMember && (
          <CustomButton
            onClick={onAddMemberClick}
            name="add-member-btn"
            theme={normalTheme}
            width={commandBarButtonsWidth}
            bgColor={memberButtonsColor}
          >
            Add Member
          </CustomButton>
        )}
        {isUserHasPermissionToRmvMember && (
          <CustomButton
            onClick={onRemoveMemberClick}
            name="delete-member-btn"
            theme={normalTheme}
            width={commandBarButtonsWidth}
            bgColor={memberButtonsColor}
          >
            Remove Member
          </CustomButton>
        )}
        {isUserHasPermissionToModRoles && (
          <CustomButton
            onClick={onModifyRolesClick}
            name="modify-roles-btn"
            theme={normalTheme}
            width={commandBarButtonsWidth}
            bgColor={roleButtonsColor}
          >
            Modify Roles
          </CustomButton>
        )}
        <CustomButton
          onClick={onExitGroupClick}
          name="exit-group-btn"
          theme={warningTheme}
          width={commandBarButtonsWidth}
        >
          Exit Group
        </CustomButton>
        {isUserHasPermissionToRmvGroup && (
          <CustomButton
            onClick={onDeleteGroupClick}
            name="delete-group-btn"
            theme={warningTheme}
            width={commandBarButtonsWidth}
          >
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
        <div className="group-info__description-container">
          {isUserHasPermissionToEditDescription && (
            <EditDescriptionIcon
              className="group-info__edit-description-button"
              onClick={toggleEditDescriptionMenu}
            />
          )}
          {isEditDescriptionMenuVisible && (
            <div className="group-info__edit-description-menu">
              <button onClick={onEditDescription}>{isEditingDescription ? "Exit" : "Edit"}</button>
            </div>
          )}
          <h3>Description:</h3>
          <br />
          {isEditingDescription ? (
            <div className="group-info__edit-description-container">
              <textarea
                value={descriptionText}
                onChange={handleDescriptionChange}
                className="group-info__edit-description-input"
              />
              <button onClick={onSaveDescription}>Save</button>
            </div>
          ) : (
            <p>{descriptionText}</p>
          )}
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
