import { OneNthOrder } from "./OneNthOrder";
import { ManyCubic } from "./ManyCubic";

export function App() {
  return (
    <>
      <header>
        <h1>Beh Zee Ay</h1>

        <p>
          <a
            href="https://en.wikipedia.org/wiki/B%C3%A9zier_curve"
            target="_blank"
          >
            Bézier curve
          </a>{" "}
          |{" "}
          <a
            href="https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm"
            target="_blank"
          >
            De Casteljau's algorithm
          </a>{" "}
          |{" "}
          <a href="https://en.wikipedia.org/wiki/Bernstein_polynomial">
            Bernstein polynomial
          </a>
        </p>
      </header>

      <hr />

      <main>
        <OneNthOrder />

        <hr />

        <ManyCubic />
      </main>

      <hr />

      <footer>
        <a href="https://github.com/felipeog/beh-zee-ay" target="_blank">
          github.com/felipeog/beh-zee-ay
        </a>
      </footer>
    </>
  );
}
