import {useContext, createContext} from 'react';
import {useReducer, useState} from 'react';
import { type InputHTMLAttributes } from 'react';
import { 
    useForm, 
    FormProvider as FormValidationProvider, 
} from 'react-hook-form';
import {IFormState, IStepState, multiStepForm, stepAction} from './interfaces';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
    [multiStepForm.firstName]: z.string().min(1),
    [multiStepForm.lastName]: z.string().min(2).max(20),
})


const FormReducer = (state:IFormState, {type, value}: {type:multiStepForm, value:string}) => ({...state, [type]: value})

const Stepreducer = (state:IStepState, type: stepAction) => {
    switch(type){
        case stepAction.IncStep:
            return {...state, step: state.step + 1}
        case stepAction.DecStep:
            return {...state, step: state.step - 1}
        default:
            return state
    }
}

const InitialFormState: IFormState = {
    [multiStepForm.firstName]: "",
    [multiStepForm.lastName]: "",
}

const InitialStepState: IStepState = {
    step: 1,
    allowNext: true,
    allowPrev: true,
}

const INITIALCONTEXTSTATE = {
    formState: InitialFormState,
    formDispatch: () => {},
    stepState: InitialStepState,
    stepDispatch: () => {},
}

const MultiFormContext = createContext(INITIALCONTEXTSTATE);

export const useMultiFormContext = () => useContext(MultiFormContext);
export const MultiFormProvider = ({children}: {children: React.ReactNode}) => {
    const [formState, formDispatch] = useReducer(FormReducer, InitialFormState);
    const [stepState, stepDispatch] = useReducer(Stepreducer, InitialStepState);
    // const [formValid, setFormValid] = useState(false);
    const methods = useForm({
        mode: 'onTouched', // Validation will trigger on the first blur event. After that, it will trigger on every change event.
        resolver: zodResolver(formSchema)
    });

    return (
        <MultiFormContext.Provider value={{
                formState, formDispatch, 
                stepState, stepDispatch
        }}>
            <FormValidationProvider {...methods}>     
                {children}
            </FormValidationProvider>
        </MultiFormContext.Provider>
    )
}