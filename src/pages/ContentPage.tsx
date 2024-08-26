import React from "react";
import AppHeader from "../cmps/app-header/AppHeader";
import GroupsSidebar from "../cmps/sidebar/GroupsSidebar";
import Feed from "../cmps/feed/FeedContent";
import MembersSidebar from "../cmps/sidebar/MembersSidebar";
import UserProfile from "../cmps/profile/UserProfile";

interface ContentPageProps {
  content: "feed" | "user-profile";
}

export default function ContentPage({ content }: ContentPageProps) {
  return (
    <section className="content-page-container">
      <AppHeader />
      <GroupsSidebar />
      <MembersSidebar />

      {content === "feed" && <Feed />}
      {content === "user-profile" && <UserProfile />}
    </section>
  );
}