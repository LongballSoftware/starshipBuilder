import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StarshipBuilder from './starship-builder.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StarshipBuilder />
  </StrictMode>,
)
