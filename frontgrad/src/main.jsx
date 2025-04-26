// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App.jsx";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Use createRoot
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Correct way
root.render(<App />);
