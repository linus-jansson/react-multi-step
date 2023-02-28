import { createContext, useReducer } from "react";


const formContext = createContext({});


const FormProvider = ({ children }) => {
    const [formState, formDispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "SET_FORM":
                return action.payload;
            default:
                return state;
        }
    }, {});

    return (
        <formContext.Provider value={{ formState, formDispatch }}>
            {children}
        </formContext.Provider>
    );
};