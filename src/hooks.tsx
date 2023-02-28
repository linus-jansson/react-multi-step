/* Hook which allows for multistep forms, show different views depending  */

import { 
    type ReactElement, 
    useState 
} from 'react';

export const useMultiStepForm = (steps: any[]) => {
    const [currentStepIdx, setCurrentStepIdx] = useState(0); // Initialize step to step 1
    const MAX_STEP = steps.length - 1; // Max step, change to generic depending on how many views

    /* Functions wrappers that interact with state */
    const nextStep = () => (currentStepIdx < MAX_STEP) ? setCurrentStepIdx(prev => prev + 1) : currentStepIdx; // Increment step
    const prevStep = () => (currentStepIdx > 0) ? setCurrentStepIdx(prev => prev - 1) : currentStepIdx;         // Decrement step
    const goToStep = (step: number) => setCurrentStepIdx(step); // Go to specific step, If needed
    
    const currentView  = steps[currentStepIdx]

    return {
        currentView,
        currentStepIdx,
        nextStep,
        prevStep,
        isFirstStep: currentStepIdx === 0,
        isLastStep: currentStepIdx === MAX_STEP,
        steps    
    }
}
