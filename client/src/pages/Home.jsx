import MapPanel from "../components/MapPanel";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="psrf">
      <header className="psrf__topbar">
        <h1 className="psrf__title">Puget Sound Restaurant Finder</h1>
      </header>

      <main className="psrf__layout">
        <section className="psrf__map">
        <MapPanel />
        </section>

        <aside className="psrf__sidebar">
          <h2 className="psrf__sidebarTitle">Restaurants</h2>

          <div className="psrf__controls">
            <label htmlFor="sortSelect">Sort by:</label>
            <select id="sortSelect" defaultValue="rating">
              <option value="rating">Rating</option>
              <option value="distance">Nearest</option>
              <option value="price">Price</option>
            </select>
          </div>

          <ul className="psrf__list">
            <li className="psrf__listItem">Restaurant A</li>
            <li className="psrf__listItem">Restaurant B</li>
            <li className="psrf__listItem">Restaurant C</li>
          </ul>
        </aside>
      </main>
    </div>
  );
}
