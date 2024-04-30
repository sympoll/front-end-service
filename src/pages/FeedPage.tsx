import React from "react";
import AppHeader from "../cmps/app-header/AppHeader";
import GroupsSidebar from "../cmps/sidebar/GroupsSidebar";
import Feed from "../cmps/feed/Feed";
import MembersSidebar from "../cmps/sidebar/MembersSidebar";

export default function FeedPage() {
  return (
    <section className="feed-page-container">
      <AppHeader />
      <GroupsSidebar />
      <MembersSidebar />
      <Feed />
    </section>
  );
}
