import React, {useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {selectError, login, cleanLogInErrors} from "../../app/features/userSlice"

function Login(props) {
    const [details, setDetails] = useState({userName:"", password: ""})

    const error = useSelector(selectError);
    const dispatch = useDispatch();

    const submitHandler = e => {
        e.preventDefault();
        dispatch(login(details));
    }

    const cancelHandler = () => {
        setDetails({userName:"", password: ""})
        dispatch(cleanLogInErrors())
    }

    return (
        <div className="login-form">
            <div>
                <form data-testid="login-formId" onSubmit={submitHandler}>
                    <div className="form-inner">
                        <div className="title">Login</div>
                        {error != null ? (<div className="error">{error}</div>) : ''}
                        <div className="form-group">
                            <label htmlFor="userName">User Name:</label>
                            <input type="text" name="userName" id="userName" 
                                onChange={e => setDetails({...details, userName: e.target.value})}
                                value={details.userName}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password" name="password" id="password"
                            onChange={e => setDetails({...details, password: e.target.value})}
                            value={details.password}/>
                        </div>
                        <button data-testid="login-form-submit-btn-Id" type="submit" className="btn-primary">LogIn</button>
                        <button data-testid="login-form-cancel-btn-Id" type="button" className="btn-danger" onClick={cancelHandler}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login

