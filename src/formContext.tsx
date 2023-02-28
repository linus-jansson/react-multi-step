import { createContext, type ReactNode, useReducer } from "react";


const formContext = createContext({});


const FormProvider = ({ children }: {children: ReactNode}) => {
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