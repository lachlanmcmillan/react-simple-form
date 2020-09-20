import React  from 'react'
import ReactDOM from 'react-dom'
import useSimpleForm from '../src/useSimpleForm';
import css from './App.css';

function App() {
  const { onSubmit, reset, register, inputs, errors, touched } = useSimpleForm();

  const handleSubmit = onSubmit(response => {
    if (!response.hasError) {
      console.log("onSubmit SUCCESS: ", response);
    } else {
      console.log("onSubmit FAIL: ", response);
    }
  });

  return (
    <div className="App">
      <form noValidate onSubmit={handleSubmit}>
        <h1>Example Form</h1>

        <div className="form-control">
          <label htmlFor="input-email">Email - required</label>
          <input
            {...register({
              name: "email",
              defaultValue: "",
              validator: val => 
                typeof val !== 'string' || val.length <= 0
                ? "Email is required"
                : !(/\w+@\w+\.\w+/.test(val))
                ? "Email is invalid"
                : undefined
            })}
            id="input-email"
            type="text"
            className={errors.email && 'input-error'}
          />
          <p>{errors.email}</p>
        </div>

        <div className="form-control">
          <label htmlFor="posint">Age</label>
          <input
            {...register({
              name: "posint",
              defaultValue: "18",
              validator: val =>
                typeof val !== 'string' || val.length <= 0
                ? undefined
                : isNaN(Number(val))
                ? "Please enter a real number" 
                : Number(val) < 18
                ? "You must be older than 18 to Submit this form"
                : undefined
            })}
            id="input-email"
            type="text"
            className={errors.posint && 'input-error'}
          />
          <p>{errors.posint}</p>
        </div>

        <div className="form-control">
          <input
            {...register({
              name: "enabled",
              defaultValue: false,
              validator: val =>
                val === true
                ? undefined
                : "You must accept the terms and conditions to proceed"
            })}
            id="input-enabled"
            type="checkbox"
            checked={inputs.enabled === true}
            // className={errors.posint && 'input-error'}
          />
          <label htmlFor="input-enabled" className="label-checkbox">Accept Terms and Conditions</label>
          <p>{errors.enabled}</p>
        </div>

        <div className="button-group">
          <button type="button" onClick={() => reset()}className="button-secondary">Clear</button>
          <button type="submit">Submit</button>
        </div>
      </form>

      <h5>useSimpleForm data</h5>
      <pre>
        <code>
          {JSON.stringify({ inputs, errors, touched }, null, 2)} 
        </code>
      </pre>

    </div>
  )
}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)