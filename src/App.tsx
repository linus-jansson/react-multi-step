import { useForm } from 'react-hook-form';

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched' // Validation will trigger on the first blur event. After that, it will trigger on every change event.
  });

  return (
    <div style={{display: "flex", flexDirection: "column", maxWidth: "20vw"}}>
        {/* onBlur={handleSubmit((data) => console.log(data))}  */}
        <input {...register('firstName')} placeholder={"Förnamn"}/>
        <input {...register('lastName', { required: true })} placeholder={"Efternamn"} />
        {errors.lastName && <span>Last name is required.</span>}
        <input {...register('age', { required:true, pattern: /\d+/ })} placeholder={"Ålder"} />
        {errors.age && <span>Please enter number for age.</span>}
    </div>
  );
}

export default App
