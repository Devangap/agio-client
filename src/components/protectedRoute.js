import React from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
function ProtectedRoute(props){
    
    
    useEffect(()=>{

    },[])






    if(localStorage.getItem("token")){
        return props.chilfren
    }else{
        return <Navigate to="/login"/>;
    }
}
export default ProtectedRoute;