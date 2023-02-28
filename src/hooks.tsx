/* Hook which allows for multistep forms, show different views depending  */

import { 
    type ReactElement, 
    useState 
} from 'react';

export const useMultiStepForm = (steps: ReactElement[]) => {
    const [step, setStep] = useState(1); // Initialize step to step 1
    const MAX_STEP = steps.length; // Max step, change to generic depending on how many views

    /* Functions wrappers that interact with state */
    const nextStep = () => (step <= MAX_STEP) ? setStep(prev => prev + 1) : step; // Increment step
    const prevStep = () => (step > 1) ? setStep(prev => prev - 1) : step; // Decrement step
    const goToStep = (step: number) => setStep(step); // Go to specific step, If needed
    const isFirstStep = () => step === 1; // Check if step is first step
    const isLastStep = () => step === MAX_STEP; // Check if step is last step
    
    const currentView  = steps[step - 1]
    return {
        currentView,
        step,
        nextStep,
        prevStep,
        isFirstStep,
        isLastStep,        
    }
}
