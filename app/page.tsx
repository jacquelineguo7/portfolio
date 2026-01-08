import BinderClip from "./components/BinderClip";
import CardHeader from "./components/CardHeader";
import CardDescription from "./components/CardDescription";

/**
 * Home Page
 * Main landing page displaying business card with personal info and links
 */
export default function Home() {
  return (
    <main className="grid-div">
      <div className="business-card">
        <BinderClip />
        <article className="card">
          <CardHeader />
          <CardDescription />
        </article>
      </div>
    </main>
  );
}
