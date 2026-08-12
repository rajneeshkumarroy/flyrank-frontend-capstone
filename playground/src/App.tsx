import { useState } from "react";
import Modal from "./components/Modal";
import Tabs from "./components/Tabs";
import Disclosure from "./components/Disclosure";
import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    {
      id: "react",
      label: "React",
      content: (
        <div>
          <h3>React</h3>
          <p>
            React is a JavaScript library for building
            user interfaces.
          </p>
        </div>
      ),
    },
    {
      id: "typescript",
      label: "TypeScript",
      content: (
        <div>
          <h3>TypeScript</h3>
          <p>
            TypeScript adds static typing to JavaScript.
          </p>
        </div>
      ),
    },
    {
      id: "accessibility",
      label: "Accessibility",
      content: (
        <div>
          <h3>Accessibility</h3>
          <p>
            Accessible interfaces allow people with different
            abilities to use the web effectively.
          </p>
        </div>
      ),
    },
  ];

  return (
    <main className="page">
      <h1>Accessible Components Playground</h1>

      {/* Modal */}
      <section className="component-section">
        <h2>Modal Dialog</h2>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Open Modal
        </button>

        <Modal
          isOpen={isModalOpen}
          title="Example Modal"
          onClose={() => setIsModalOpen(false)}
        >
          <p>
            This is an accessible modal dialog built from
            scratch using React and TypeScript.
          </p>

          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
          >
            Confirm
          </button>
        </Modal>
      </section>

      {/* Tabs */}
      <section className="component-section">
        <h2>Tabs</h2>

        <Tabs tabs={tabs} />
      </section>

      {/* Disclosure */}
      <section className="component-section">
        <h2>Disclosure</h2>

        <Disclosure title="What is accessible design?">
          <p>
            Accessible design makes websites and applications
            usable by people with different abilities and needs.
          </p>
        </Disclosure>
      </section>
    </main>
  );
}

export default App;