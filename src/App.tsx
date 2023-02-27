import { InputHTMLAttributes, useEffect } from 'react';
import { 
    useForm, 
    FormProvider as FormValidationProvider, 
    useFormContext as useFormValidationProvider 
} from 'react-hook-form';


import { useMultiFormContext, MultiFormProvider } from './MultiFormContext';
import { useReducer } from 'react';

interface IInputfield extends InputHTMLAttributes<HTMLInputElement>  {
    name: string,
    validationOptions?: any,
    rest?: InputHTMLAttributes<HTMLInputElement>
}

function InputField({name, validationOptions, ...rest}: IInputfield){
    // Inputfield that takes use of useFormContext from react-hook-form, can send validateOptions for validation
    const { register, formState: { errors } } = useFormValidationProvider();
    
    // console.log(validationOptions)
    // console.log(errors)

    const error = errors?.[name];
    console.log("Errors", error)
    return (
        <>
            <input 
                type="text"
                id={name}
                style={{border: error ? "2px solid red" : "1px solid black"}}
                {...register(name)}
                {...rest}
            />
            {error && <label htmlFor={name}>*This field is required</label>}
        </>
    )
}

const CurrentForm = () => {
    // use FormStateContext
    // const handler = (e: any) => formContextDispatcher({type: e.target.name, value: e.target.value})
    const { formState, formDispatch, stepState, stepDispatch } = useMultiFormContext();
    switch (stepState.step) {
        case 1:
            return <InputField name={multiStepForm.firstName} placeholder="Förnamn" onChange={(e) => handler(e)} value={formState?.firstName} />;
        case 2:
            return <InputField name={multiStepForm.lastName} placeholder="Efternamn" onChange={(e) => handler(e)} value={formState?.lastName} />;
        default:
            return <></>;
    }
}

function App() {

    const handler = (e: any) => formDispatch({type: e.target.name, value: e.target.value})
    // const handler = (e: any) => console.log(e)



    return (
        <>
            <InputField name={"firstname"} placeholder="Förnamn" onChange={(e) => handler(e)} value={formState.firstName} />
            <InputField name={multiStepForm.lastName} placeholder="Efternamn" onChange={(e) => handler(e)} value={formState?.lastName} />
            {/*  */}
            <button onClick={() => stepDispatch(stepAction.DecStep)}>Prev</button>
            <button onClick={() => stepDispatch(stepAction.IncStep)}>Next</button>
            <p>Current step: {stepState.step}</p>
            <pre>{JSON.stringify(formState, null, 2)}</pre>
        </>
    );
}

export default <MultiFormProvider><App/></MultiFormProvider>
