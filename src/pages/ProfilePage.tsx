import React from "react";
import AppHeader from "../cmps/app-header/AppHeader";
import GroupsSidebar from "../cmps/sidebar/GroupsSidebar";
import MembersSidebar from "../cmps/sidebar/MembersSidebar";
import Profile from "../cmps/profile/Profile";

export default function ProfilePage() {
  return (
    <section className="profile-page-container">
      <AppHeader />
      <GroupsSidebar />
      <MembersSidebar />
      <Profile />
    </section>
  );
}
