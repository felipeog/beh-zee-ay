import { OneNthOrder } from "./OneNthOrder";
import { ManyCubic } from "./ManyCubic";
import "./App.style.css";

export function App() {
  return (
    <main className="App">
      <h1>Beh Zee Ay</h1>

      <p>
        <a
          href="https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm"
          target="_blank"
        >
          De Casteljau's algorithm
        </a>
      </p>

      <br />
      <hr />
      <br />

      <OneNthOrder />

      <br />
      <hr />
      <br />

      <ManyCubic />
    </main>
  );
}
