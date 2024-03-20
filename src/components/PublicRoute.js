import React from 'react'
import { Navigate } from 'react-router';
function PublicRoute(props) {
    if(localStorage.getItem('token')){
        return <Navigate to ="/"/>
    }else{
        
        return props.children;

    }
  

}

export default PublicRoute
