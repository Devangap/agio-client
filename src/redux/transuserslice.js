import {createSlice} from "@reduxjs/toolkit";

export const transuserslice = createSlice(
    {
        name: "user",
        initialState : {
            user: null,
        },
        reducers : {
            trsetUser: (state,action) => {
                state.user = action.payload;

            },
           
        }

    }
);

export const {trsetUser} = userSlice.actions;