import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './routes/homepage/HomePage.jsx';
import DashboardPage from './routes/dashboardpage/DashboardPage.jsx';
import ChatPage from './routes/chatpage/ChatPage.jsx';
import RootLayout from './layouts/rootlayout/RootLayout.jsx';
import DashboardLayout from './layouts/dashboardlayout/DashboardLayout.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children:[
      {path: "/", element: <HomePage />},
      {
        element: <DashboardLayout />,
        children: [
          {path: "/dashboard", element: <DashboardPage />},
          {path: "/dashboard/chats/:id", element: <ChatPage />}
        ]
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
