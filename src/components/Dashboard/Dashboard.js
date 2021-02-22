import React, {useEffect} from 'react'
import {useSelector, useDispatch} from "react-redux";
import {selectUser, logout, selectIsUserLogedIn} from "../../app/features/userSlice";
import {getPosts, selectIsLoading, selectPosts} from "../../app/features/userDashboardSlice";


function Dashboard(props) {
    const user = useSelector(selectUser);
    const isLoginIn = useSelector(selectIsUserLogedIn);
    const isLoading = useSelector(selectIsLoading);
    const posts = useSelector(selectPosts);

    const dispatch = useDispatch();

    const logoutHandler = (e) => {
         dispatch(logout())
    }
   
    useEffect(() => {
        if(isLoginIn) {
            dispatch(getPosts());
        }
      }, [dispatch]);

    return (
        <div className="dash-board">
            <div className="nav-bar">
                <div className="logo">Logo</div> 
                <div className="band"><span>User Dashboard</span></div> 
                <div className="user-details">
                        <span className="user-name">{user && user.userName}</span>
                        <button className="btn-danger" onClick={logoutHandler}> LogOut</button>
                </div>
            </div>
            <div className="blog">
                {isLoading? <h1 className="loading-text">...Loading</h1> : ""}
                {posts?.map(post => (
                     <div className="blog-post" key={post.id}> 
                         <div className="post-title">{post.title}</div>
                         <div className="post-body">{post.body}</div>
                     </div>
                ))}
            </div>
        </div>
    )
}

export default Dashboard
