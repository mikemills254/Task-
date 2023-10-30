import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Home from './Pages/Home'
import { useSelector } from 'react-redux'

const App = () => {
    const isAuthenticated = useSelector((state:any) => state.auth.isAuthenticated)
    const accessToken = useSelector((state:any) => state.auth.accessToken);

    useEffect(() => {
        console.log('Is authentecated:', isAuthenticated)
    },[accessToken])
    return (
        <div className="Body m-0 p-0 flex-grow-0 flex align-middle justify-center">
            <Router>
                <Routes>
                    {!isAuthenticated ? (
                        <>
                            <Route path='/' element={<SignIn/>}/>
                            <Route path='/SignUp' element={<SignUp/>}/>
                        </>
                    ): (
                        <Route path='/' element={<Home/>}/>
                    )}
                    
                </Routes>
            </Router>
        </div>
    )
}


export default App