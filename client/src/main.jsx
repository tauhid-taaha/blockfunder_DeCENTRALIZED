import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "./index.css";
import { StateContextProvider } from "./context";
import App from "./App";
import { Sepolia } from "@thirdweb-dev/chains";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThirdwebProvider
    activeChain={Sepolia}
    clientId="a6b0c2d5d0926719296c3d5bf2bf5ec5"
  >
    <Router>
      <StateContextProvider>
        <Auth0Provider
          domain="dev-vwmgruw6gs4yfwnj.us.auth0.com"
          clientId="sGkEYjUGIyYCVRs8QYgo1mdnDVARNtUB"
          authorizationParams={{
            redirect_uri: window.location.origin,
          }}
        >
          <App />
        </Auth0Provider>
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);
