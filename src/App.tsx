import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'

const App = () => {
    return (
        <div className="body m-0 p-0 h-[100vh] flex align-middle justify-center">
            <Router>
                <Routes>
                    <Route path='/' element={<SignIn/>}/>
                    <Route path='/SignUp' element={<SignUp/>}/>
                </Routes>
            </Router>
        </div>
    )
}


export default App