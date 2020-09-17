import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import useSimpleForm from '../src/useSimpleForm';

function App() {
  const { onSubmit, register, inputs, errors, touched } = useSimpleForm();
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <form noValidate onSubmit={onSubmit(console.log)} style={styles.form}>
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="input-email">Email</label>
          <input
            {...register({
              name: "email",
              defaultValue: ""
            })}
            id="input-email"
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      <h5>useSimpleForm data</h5>
      <pre>inputs: {JSON.stringify(inputs, null, 2)} </pre>

    </div>
  )
}

const styles = {
  form: {
    margin: 50,
    padding: 20,
    maxWidth: 300,
    background: '#FAFAFA',
    border: '2px solid #AAA'
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)