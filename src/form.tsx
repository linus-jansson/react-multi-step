import { useReducer, type FormEvent, Fragment, type InputHTMLAttributes, ReactNode } from "react"
import { FormProvider, useFormContext, useForm } from "react-hook-form"

import {useMultiStepForm, } from "./hooks"

import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface IInputfield extends InputHTMLAttributes<HTMLInputElement>  {
    name: string,
    rest?: InputHTMLAttributes<HTMLInputElement>
}

// Enum för form, används för att kunna använda samma namn på inputfältet och i formSchema och interface
export const enum multiStepForm {
    firstName = "firstName",
    lastName = "lastName",
    dateBooked = "dateBooked",
    email = "email",
}


export interface IFormState {
    [multiStepForm.firstName]: string,
    [multiStepForm.lastName]: string,
    [multiStepForm.dateBooked]: string,
    [multiStepForm.email]: string,
}

interface Field {
    name: string, // field name in formSchema, input, data to be sent to backend see example below
    type: string, // type (text, date, etc)
    required: boolean, // required or not
    placeholder: string,
    value: string, // input value to be parsed with inputType
}

interface ViewData {
    viewId: number,
    title: string,
    fields: Field[]
}

export interface FormState extends Array<ViewData> {}

/*
state example:

    form: [
        {
            viewId: 1, 
            view: "date",
            fields: [
                {inputType: "date", value: "2023-10-10" key: "dateBooked"}
            ]
        },
        {
            viewId: 2,
            view: "PersonalInfo",
            fields: [
                {inputType: "text", value: "81293712837", key: "persNr"},
                {inputType: "boolean", value: "true", key: "missingPersonNr"},
            ]
        }
    ]

- When a state change happens in a field push to the inputAnswers array in the current view object
- When the form is submitted, parse the FormAnswers to the IBooking interface and sent to backend
*/

function Summary() {
    return (
        <Fragment>
            <pre>{JSON.stringify()}</pre>
        </Fragment>
    )
}

// Ska jag spara state med useState eller använda useReducer?

function ViewWrapper({children}: {children: ReactNode}) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "20vw",
        }}>
            {children}
        </div>
    )
}

const InitialFormState: FormState = [
    {
        viewId: 0, 
        title: "Personuppgifter",
        fields: [
            {name: multiStepForm.firstName, placeholder:"Förnamn", type: "text", required: true, value: ""},
            {name: multiStepForm.lastName, placeholder:"Efternamn", type: "text", required: true, value: ""},
            {name: multiStepForm.email, placeholder:"Email", type: "email", required: true, value: ""},
        ]
    },
    {
        viewId: 1,
        title: "Datum",
        fields: [
            {name: multiStepForm.lastName, placeholder:"Datum", type: "date", required: true , value:""},
        ]
    }
]

const FormReducer = (state: FormState, {viewId, type, value}: 
    {viewId: number, type: multiStepForm, value: any}
) => {
    const newFields = [...state[viewId].fields];
    const fieldIndex = newFields.findIndex((x) => x.name === type);
    newFields[fieldIndex].value = value;
    
    const newState = [...state];
    newState[viewId] = { ...state[viewId], fields: newFields };
    
    return newState;
}
export default function Form() {
    const [viewState, dispatch] = useReducer(FormReducer, InitialFormState)

    const {
        currentView, 
        currentStepIdx, 
        nextStep, 
        prevStep, 
        isFirstStep, 
        isLastStep
    } = useMultiStepForm(viewState)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        nextStep();
    }

    console.log("currentView from useMultiStepForm", viewState[currentStepIdx])
    const {viewId, title, fields} = viewState[currentStepIdx]
    return (
        <Fragment>
            <form onSubmit={handleSubmit}>
                <h1>{title}</h1>
                <ViewWrapper>
                    {fields.map((field: Field) => <input
                            key={field.name}
                            name={field.name}
                            type={field.type}
                            required={field.required || false}
                            placeholder={field.placeholder}
                            value={field.value} // Not working
                            onChange={(e) => dispatch({
                                    viewId: viewId, 
                                    type: (field.name as multiStepForm), 
                                    value: e.target.value
                                })
                            }
                        />
                    )}
                </ViewWrapper>
                <button type="button" onClick={prevStep}>prev</button>
                <button>next</button>
                <div>
                    <span>View id: {viewId}</span>
                    <br/>
                    <span>Current step index: {currentStepIdx}</span>
                </div>
                <pre>{JSON.stringify(viewState, null, 4)}</pre>
            </form>
            {/* {isLastStep && <Summary/>} */}
        </Fragment>
    )
}

// Flytta types till lib göra enums, bryta ut



/* TODO
    1. Store state in context
    2. Use context in form views
    3. 

*/