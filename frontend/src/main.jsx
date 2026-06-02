import React from "react";
import ReactDOM from "react-dom/client";
import RoadWarriorRiderNetwork from "./RoadWarriorRiderNetwork";
import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RoadWarriorRiderNetwork />
  </React.StrictMode>
);