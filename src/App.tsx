import "./assets/styles/main.scss";
import reactLogo from "./assets/react.svg";
import AppHeader from "./cmps/AppHeader";
import FeedPage from "./pages/FeedPage";

function App() {
  return (
    <div className="App">
      <AppHeader />
      <FeedPage />
    </div>
  );
}

export default App;
