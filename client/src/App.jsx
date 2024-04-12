import React, { useState } from "react";
import { Home } from "./views/Home";
import RecentInsertionPage from "./views/RecentInsertionPage";
import { LoadingProvider } from "./contexts/LoadingContext";


const App = () => {
  const [databaseEntry, setDatabaseEntry] = useState(null);
  
  return (
    <>
      <LoadingProvider>
        {databaseEntry ? (
          <RecentInsertionPage databaseEntry={databaseEntry} />
        ) : (
          <Home
            databaseEntry={databaseEntry}
            setDatabaseEntry={setDatabaseEntry}
          />
        )}
      </LoadingProvider>
    </>
  );
};

export default App;
