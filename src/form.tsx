import { FormEvent, Fragment, InputHTMLAttributes } from "react"
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
    email = "dateBooked",
}


export interface IFormState {
    [multiStepForm.firstName]: string,
    [multiStepForm.lastName]: string,
    [multiStepForm.dateBooked]: string,
    [multiStepForm.email]: string,
}

interface FormState {
    formAnswers: {
        viewId: number,
        inputAnswers: {
            key: string, // field name in formSchema, input, data to be sent to backend see example below
            inputType: string, // type (text, date, etc)
            value: string, // input value to be parsed with inputType
        }[]
    }[]
}


/*
state example:

    formAnswers: [
        {
            viewId: 1, 
            view: "date",
            inputAnswers: [
                {inputType: "date", value: "2023-10-10" key: "dateBooked"}
            ]
        },
        {
            viewId: 2,
            view: "PersonalInfo",
            inputAnswers: [
                {inputType: "text", value: "81293712837", key: "persNr"},
                {inputType: "boolean", value: "true", key: "missingPersonNr"},
            ]
        }
    ]

- When a state change happens in a field push to the inputAnswers array in the current view object
- When the form is submitted, parse the FormAnswers to the IBooking interface and sent to backend
*/

const formSchema = z.object({
    [multiStepForm.firstName]: z.string().min(1),
    [multiStepForm.lastName]: z.string().min(2).max(20),
    [multiStepForm.email]: z.string().email(),
    [multiStepForm.dateBooked]: z.string().datetime(),
})

function Input({name, ...rest}: IInputfield) {
    const { register, formState: { errors } } = useFormContext();
    const error = errors?.[name];

    return (
        <Fragment>
            <input 
                type="text"
                id={name}
                style={{border: error ? "2px solid red" : "1px solid black"}} // Custom styling for error support
                {...register(name)}
                {...rest}
            />
            {error && <label htmlFor={name}>*This field is required</label>}
        </Fragment>
    )
}

function DatePicker() {
    return (
        <Fragment>
            <Input name={multiStepForm.firstName} placeholder="test 1" type='date' />
        </Fragment>
    )
}

function PersonalInfo() {
    return (
        <Fragment>
            <Input name={multiStepForm.lastName} placeholder="test 2" />
        </Fragment>
    )
}

function Summary() {
    return (
        <Fragment>
            <pre>{JSON.stringify()}</pre>
        </Fragment>
    )
}

// Ska jag spara state med useState eller använda useReducer?

function View({id, fields}: {id: number, fields: any[], }) {
    return (
        <Fragment>
            {id}
            {fields.map((field) =>{
                return (
                    <input 
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        onChange={(e) => console.log(e.target.value)}
                    />
                )
            })}
        </Fragment>

    )
}




const INITIAL_STATE: FormState = {
    formAnswers: []
}
export default function Form() {
    // used for validation
    const methods = useForm({
        mode: 'onTouched', // Validation will trigger on the first blur event. After that, it will trigger on every change event.
        resolver: zodResolver(formSchema)
    });

    // const views = [
    //     {id: 1, view: <DatePicker />},
    //     {id: 2, view: <PersonalInfo />},
    // ]
    const views = [
        {
            id: 1, 
            fields: [
                {name: multiStepForm.firstName, placeholder:"Förnamn", type: "text", required: true},
                {name: multiStepForm.lastName, placeholder:"Efternamn", type: "text", required: true},
                {name: multiStepForm.email, placeholder:"Email", type: "email", required: true},
            ]
        },
        {
            id: 2, 
            fields: [
                {name: multiStepForm.lastName, placeholder:"Datum", type: "date", required: true},
            ]
        },
    ]

    const {currentView, currentStepIdx, nextStep, prevStep, isFirstStep, isLastStep} = 
        useMultiStepForm(views)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        nextStep();
    }

    console.log()
    
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit}>
                <div>
                    <View {...currentView} />
                </div>
                <button type="button" onClick={prevStep}>prev</button>
                <button>next</button>
                {currentStepIdx}
            </form>
            {isLastStep && <Summary/>}
        </FormProvider>
    )
}

// Flytta types till lib göra enums, bryta ut



/* TODO
    1. Store state in context
    2. Use context in form views
    3. 

*/