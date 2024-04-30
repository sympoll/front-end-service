import React from "react";
import AppHeader from "../cmps/app-header/AppHeader";
import Sidebar from "../cmps/sidebar/GroupsSidebar";
import Feed from "../cmps/feed/Feed";

export default function FeedPage() {
  return (
    <section className="feed-page-container">
      <AppHeader />
      <Sidebar />
      <Feed />
    </section>
  );
}
