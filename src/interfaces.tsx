// Enum för form, används för att kunna använda samma namn på inputfältet och i formSchema och interface
export const enum multiStepForm {
    firstName = "firstName",
    lastName = "lastName",
}
export  const enum stepAction {
    IncStep = "IncStep",
    DecStep = "DecStep",
}



export interface IFormState {
    [multiStepForm.firstName]: string,
    [multiStepForm.lastName]: string,
}

export interface IStepState {
    step: number,
    allowNext: boolean,
    allowPrev: boolean,
}
