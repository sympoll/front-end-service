import React, { useEffect, useState } from "react";
import AppHeader from "../cmps/app-header/AppHeader";
import GroupsSidebar from "../cmps/sidebar/GroupsSidebar";
import Feed from "../cmps/feed/FeedContent";
import MembersSidebar from "../cmps/sidebar/MembersSidebar";
import UserProfile from "../cmps/profile/UserProfile";
import GroupInfo from "../cmps/group/GroupInfoPage";
import { fetchUserData } from "../services/user.profile.service";
import { UserData } from "../models/UserData.model";
import LoadingAnimation from "../cmps/global/LoadingAnimation";

interface ContentPageProps {
  content: "feed" | "user-profile" | "group-info";
}

export default function ContentPage({ content }: ContentPageProps) {
  const loggedInUserId = import.meta.env.VITE_DEBUG_USER_ID; // Temporarily using hardcoded logged-in user ID
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    fetchUserData(loggedInUserId)
      .then((userData) => {
        setLoggedInUser(userData);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Error fetching user data for user ID: ${loggedInUserId}. Error: ${err}`);
        setLoading(false);
      });
  }, [loggedInUserId]);

  if (loading) {
    return <LoadingAnimation message="Loading User Data" dots="off" />;
  }

  if (error) {
    return <section className="content-page-container">{error}</section>;
  }

  if (!loggedInUser) {
    return (
      <section className="content-page-container">
        {"Error fetching logged in user data..."}
      </section>
    );
  }

  return (
    <section className="content-page-container">
      <AppHeader />
      <GroupsSidebar userData={loggedInUser} />
      <MembersSidebar />

      {content === "feed" && <Feed />}
      {content === "user-profile" && <UserProfile />}
      {content === "group-info" && <GroupInfo />}
    </section>
  );
}
