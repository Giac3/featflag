import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import Router from './Router.tsx'
import AuthProvider from './context/AuthProvider.tsx'
import FeatFlagProvider from './context/FeatFlagProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <FeatFlagProvider>
    <Router />
    </FeatFlagProvider>
    </AuthProvider>
  </React.StrictMode>,
)
