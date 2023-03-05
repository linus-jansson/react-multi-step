/* Hook which allows for multistep forms, show different views depending  */

import { 
    type ReactElement, 
    useState,
    cloneElement
} from 'react';

export const useMultiStepForm = (steps: ReactElement[]) => {
    const [currentStepIdx, setCurrentStepIdx] = useState(0); // Initialize step to step 1
    const [allowContinue, setAllowContinue] = useState(false); // Initialize step to step 1
    const MAX_STEP = steps.length - 1; // Max step, change to generic depending on how many views

    /* Functions wrappers that interact with state */
    const nextStep = () => {
        // If current step is less than max step, increment step
        if (currentStepIdx < MAX_STEP) {
            setCurrentStepIdx(prev => prev + 1); // Increment step
            setAllowContinue(false);
        }   
        return currentStepIdx;
    }
    const prevStep = () => (currentStepIdx > 0) ? setCurrentStepIdx(prev => prev - 1) : currentStepIdx;         // Decrement step
    const goToStep = (step: number) => setCurrentStepIdx(step); // Go to specific step, If needed
    // const allowNextStep = () => setAllowContinue(true);

    /* Clone the current view and pass in the current step index as a prop */
    steps[currentStepIdx] = cloneElement(steps[currentStepIdx], { id: currentStepIdx });

    const currentView  = steps[currentStepIdx]

    return {
        currentView,
        currentStepIdx,
        nextStep,
        prevStep,
        isFirstStep: currentStepIdx === 0,
        isLastStep: currentStepIdx === MAX_STEP,
        steps,
        allowContinue: allowContinue, 
    }
}
