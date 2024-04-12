import React, { useState } from "react";
import { Home } from "./views/Home";
import RecentInsertionPage from "./views/RecentInsertionPage";

const App = () => {
  const [databaseEntry, setDatabaseEntry] = useState(null);

  return (
    <>
      {databaseEntry ? (
        <RecentInsertionPage databaseEntry={databaseEntry} />
      ) : (
        <Home
          databaseEntry={databaseEntry}
          setDatabaseEntry={setDatabaseEntry}
        />
      )}
    </>
  );
};

export default App;
