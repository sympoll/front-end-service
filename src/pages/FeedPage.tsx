import React from "react";
import AppHeader from "../cmps/app-header/AppHeader";
import Sidebar from "../cmps/sidebar/Sidebar";

export default function FeedPage() {
  return (
    <section className="feed-page-container">
      <AppHeader />
      <Sidebar />
      <div>Polls Feed</div>
    </section>
  );
}
