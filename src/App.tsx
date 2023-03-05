import { useState, useReducer, FormEvent } from 'react'

import { useMultiStepForm } from './hooks'

type IState = {
    [key: string | number]: {
        [key: string]: {
            name: string,
            type: string,
            value: string,
        }
    }
}

function View1() {
    return (
        <div>
            <h1>View 1</h1>
            <input type="date" name="" id="" required={false} />
        </div>
    )
}

const enum ACTIONTYPES {
    PERS_NR = "PERS_NR", 
    PHONE_NUMBER = "PHONE_NUMBER", 
    EMAIL = "EMAIL", 
    MISSING_PERS_NR = "MISSING_PERS_NR", 
    FIRST_NAME = "FIRST_NAME", 
    FIRST_NAME_SECOND = "FIRST_NAME_SECOND", 
    LAST_NAME = "LAST_NAME", 
    ADRESS = "ADRESS", 
    POSTALCODE = "POSTALCODE", 
    CITY = "CITY", 
    COUNTRY = "COUNTRY", 
    NATIONALITY = "NATIONALITY", 
    DATE_OF_BIRTH = "DATE_OF_BIRTH", 
    MARKED_CONFIDENTIAL = "MARKED_CONFIDENTIAL"
}

function View2({title, currentView, state, dispatch}: {title: string, currentView:number, state:any, dispatch: (d:any) => void}) {
    const [missingPersNr, setMissingPersNr] = useState(false)

    const fieldsStandard = [
        {type: "text", placeholder: 'socialSecurityNumber', name:"persNr", action: ACTIONTYPES.PERS_NR},
        {type: "text", placeholder: 'telephoneNumber', name:"telephone", action: ACTIONTYPES.PHONE_NUMBER},
        {type: "text", placeholder: 'email', name:"email", action: ACTIONTYPES.EMAIL},
    ]
    
    const fieldsAdditional = [
        {type: "text", placeholder: "firstName", name:"firstName", action: ACTIONTYPES.FIRST_NAME},
        {type: "text", placeholder: "firstNameSecond", name:"firstnamesecond", action: ACTIONTYPES.FIRST_NAME_SECOND},
        {type: "text", placeholder: "lastName", name:"lastname", action: ACTIONTYPES.LAST_NAME},
        {type: "text", placeholder: "adress", name:"adress", action: ACTIONTYPES.ADRESS},
        {type: "text", placeholder: "postalCode", name:"postalCode", action: ACTIONTYPES.POSTALCODE},
        {type: "text", placeholder: "town", name:"city", action: ACTIONTYPES.CITY},
        {type: "text", placeholder: "country", name:"country", action: ACTIONTYPES.COUNTRY},
        {type: "text", placeholder: "nationality", name:"nationality", action: ACTIONTYPES.NATIONALITY},
        {type: "date", placeholder: "dateOfBirth", name:"dateOfBirth", action: ACTIONTYPES.DATE_OF_BIRTH},
        {type: "checkbox", placeholder: 'markedConfidential', name:"markedConfidential", action: ACTIONTYPES.MARKED_CONFIDENTIAL},
    ]

    const HandleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        dispatch({name: name, value: value, type: target.type, view:id})
    }


    const HandleMissingNr = (event: InputEvent<HTMLInputElement>) => {
        setMissingPersNr(event.target.checked)
        // dispatch({type: ACTIONTYPES.MISSING_PERS_NR, value: e.target.checked})
    }

    const fieldsToShow = !missingPersNr ? fieldsStandard :  fieldsAdditional

    return (
        <div>
            
            <label htmlFor="missingPnrCheckbox">Saknar personnummer</label>
            <input type='checkbox' name="missingPnrCheckbox" onChange={HandleMissingNr} />
            <h1>{title}</h1>
            { fieldsToShow.map((field, idx) => {
                    // Assuming your input field has props `view` and `name`
                    const value = state[currentView]?.[field.name]?.value || '';
                    return (
                        <div key={idx}>
                            <input 
                                type={field.type}
                                placeholder={field.placeholder}
                                name={field.name}
                                value={value}
                                onChange={HandleChange}
                                />
                        </div>
                    )
                })
            }
        </div>
    )
}
function View3() {
    return (
        <div>
            <h1>View 3</h1>
        </div>
    )
}



// const InitialState: IState[] | [] = [
//     {
//         viewIndex: 1,
//         viewAnswers: []
//     },

// ]

type FormAction = 
{
    view: number,
    name: string,
    value: string,
    type: string
}
const FormReducer = (state: IState[], action: FormAction) =>  {
    const { view, name, value, type } = action;
    if (!view) {
        // handle case where view is undefined
        console.log("view is undefined");
        return state;
      }
    
      // check if the view already exists in the state
      if (!state[view]) {
        // if it doesn't exist, create a new object for the view
        state[view] = {};
      }
    
      // check if the input already exists in the view
      if (!state[view][name]) {
        // if it doesn't exist, create a new object for the input
        state[view][name] = { value, type, name };
      }
    
      // update the value of the input
      state[view][name].value = value;
    
      return { ...state };
};
/*
    const state = [
        {
            viewIndex: 1,
            viewAnswers: [
                { name: 'persNr', type: 'text', value: '1234567890'}
            ]

        },
        {
            viewIndex: 2,
            viewAnswers: [
                { name: 'dateBooked', type: 'date', value: '2021-01-01' },  
                { name: 'dateOfTravel', type: 'date', value: '2021-01-01', },
                { name: 'email', type: 'email', value: 'a@gmail.com',}
            },
        }
    ]
*/

const InitialState = {
}



function App() {
    const [formState, formDispatch] = useReducer(FormReducer, InitialState)
    const multiStep = useMultiStepForm([
            <View1 title="Datum bokning" state={formState} dispatch={formDispatch} />,
            <View2 title="Personuppgifter Person 1" state={formState} dispatch={formDispatch}  />,
            <View2 title="Personuppgifter Person 2" state={formState} dispatch={formDispatch}  />,
            <View3 />
        ]) 

    const HandleSubmit = (event: FormEvent) => {
        event.preventDefault();

        multiStep.nextStep();
    }

    return (
        <form onSubmit={HandleSubmit}>
            {multiStep.currentView}
            <button type='button' onClick={multiStep.prevStep} >prev</button>
            <button disabled={multiStep.allowContinue}>next</button>
        </form>
    )
}

export default App
