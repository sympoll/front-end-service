import React, { useCallback, useEffect, useState } from "react";
import AppHeader from "../cmps/app-header/AppHeader";
import GroupsSidebar from "../cmps/sidebar/GroupsSidebar";
import Feed from "../cmps/feed/FeedContent";
import MembersSidebar from "../cmps/sidebar/MembersSidebar";
import UserProfile from "../cmps/profile/UserProfile";
import GroupInfo from "../cmps/profile/GroupProfile";
import { fetchUserData } from "../services/user.profile.service";
import { UserData } from "../models/UserData.model";
import LoadingAnimation from "../cmps/global/LoadingAnimation";
import { useUser } from "../context/UserContext";
import { useUpdateContext } from "../context/UpdateContext";

interface ContentPageProps {
  content: "feed" | "user-profile" | "group-info";
}

export default function ContentPage({ content }: ContentPageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { registerForUpdate } = useUpdateContext();

  const { user: loggedInUser, setUser: setLoggedInUser } = useUser();

  /* ----------- Fetch logged in user data ----------- */
  // const { user } = useUser();

  // Update logged in user's data when the userId changes.
  // useEffect(() => {
  //   updateLoggedInUser();
  // }, [user?.userId]);

  // const updateLoggedInUser = useCallback(async () => {
  //   setLoading(true);

  //   if (user) {
  //     fetchUserData(user?.userId)
  //       .then((userData) => {
  //         setLoggedInUser(userData);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         setError(`Error fetching user data for user ID: ${user?.userId}. Error: ${err}`);
  //         setLoading(false);
  //       });
  //   }
  // }, [user?.userId]);

  // useEffect(() => {
  //   const unregister = registerForUpdate(updateLoggedInUser);
  //   return () => {
  //     unregister();
  //   };
  // }, [registerForUpdate, updateLoggedInUser]);
  /* --------------------------------------- */
  /* ----------- Fetch demo data ----------- */
  const loggedInUserDemoDataId = import.meta.env.VITE_DEBUG_USER_ID;
  useEffect(() => {
    fetchUserData(loggedInUserDemoDataId)
      .then((userData) => {
        setLoggedInUser(userData);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Error fetching user data for user ID: ${loggedInUserDemoDataId}. Error: ${err}`);
        setLoading(false);
      });
  }, [loggedInUserDemoDataId]);
  /* --------------------------------------- */

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
