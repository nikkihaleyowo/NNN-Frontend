
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import ThreadPage from './pages/ThreadPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:page" element={<HomePage />}/>
        <Route path="/" element={<HomePage />}/>
        <Route path="/thread/:id" element={<ThreadPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
