import React from 'react'
import { Navigate } from 'react-router';
function PublicRoute(props) {
    if(localStorage.getItem('token')){
       
    }else{
        
        return props.children;

    }
  

}

export default PublicRoute
