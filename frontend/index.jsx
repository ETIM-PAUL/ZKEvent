import React, { ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Component from './components/index';
import initNoirC from '@noir-lang/noirc_abi';
import initACVM from '@noir-lang/acvm_js';
import { WagmiConfig } from 'wagmi';
// import { config } from './utils/wagmi';
import { Web3ModalProvider } from './Web3Modal';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './src/App';
import AllEventsPage from "./src/pages/AllEventsPage";
import EventDetailsPage from "./src/pages/EventDetailsPage";
import CreateEventPage from "./src/pages/CreateEventPage";
import UserDashboardPage from "./src/pages/UserDashboardPage";

const InitWasm = ({ children }) => {
  const [init, setInit] = React.useState(false);
  useEffect(() => {
    (async () => {
      await Promise.all([
        initACVM(new URL('@noir-lang/acvm_js/web/acvm_js_bg.wasm', import.meta.url).toString()),
        initNoirC(
          new URL('@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm', import.meta.url).toString(),
        ),
      ]);
      setInit(true);
    })();
  });

  return <div>{init && children}</div>;
};

// export function Providers({ children }) {
//   const [mounted, setMounted] = React.useState(false);
//   React.useEffect(() => setMounted(true), []);
//   return <WagmiConfig config={config}>{mounted && children}</WagmiConfig>;
// }

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/events",
    element: <AllEventsPage />,
  },

  {
    path: "/event-details/:id",
    element: <EventDetailsPage />,
  },

  {
    path: "/create-event",
    element: <CreateEventPage />,
  },

  {
    path: "/user-dashboard",
    element: <UserDashboardPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <InitWasm>
    <Web3ModalProvider>
      {/* <Component /> */}
      <RouterProvider router={router} />
      <ToastContainer />
    </Web3ModalProvider>
  </InitWasm>
);
