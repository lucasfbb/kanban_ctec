import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { StyleSheetManager } from 'styled-components'

createRoot(document.getElementById('root')!).render(  // Aqui, você inicializa a aplicação React no elemento HTML com o id root (definido no seu index.html).
  <Suspense fallback={<div>Carregando...</div>}> 
    <BrowserRouter>
      <StyleSheetManager shouldForwardProp={(prop) => prop !== "shake"}>
        <App />
      </StyleSheetManager>
    </BrowserRouter>
  </Suspense>
)
