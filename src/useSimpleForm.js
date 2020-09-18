import React from 'react';

/**
 * @return {{
 *   onSubmit: () => void, 
 *   register: () => void,
 *   inputs: { [name: string]: string) }
 *   errors: { [name: string]: string) },
 *   touched: { [name: string]: string) }
 * }}
 */
 const useSimpleForm = () => {
  let validators = {};
  const [inputs, setInputs] = React.useState({});
  const [defaults, setDefaults] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  /** Helper functions **/ 
  const setInput = (name, value) => setInputs(i => ({ ...i, [name]: value })); 
  const setDefault = (name, value) => setDefaults(d => ({ ...d, [name]: value })); 
  const setTouch = (name) => setTouched(t => ({ ...t, [name]: true })); 
  const setError = (name, message) => setErrors(e => ({ ...e, [name]: message }));
  const deleteError = (name) => setErrors(e => {
    const newErrors = { ...e };
    delete newErrors[name];
    return newErrors
  })
  /** End **/

  const onSubmit = (callback) => {
    return (evt) => {
      evt.preventDefault();

      let newErrors = { ...errors }
      // validate all
      Object.entries(validators).forEach(([name, validator]) => {
        if (!(name in touched)) { 
          const value = inputs[name]; // defaultValue or undefined

          const result = validate(name, value);
          // we push to newErrors manually here, because the React.setState
          // call in validate will not have evaluated yet 
          if (result) {
            newErrors[name] = result;
          }
        } 
      });

      const hasError = Object.keys(newErrors).length > 0;     
      callback({ inputs, errors, hasError })
    }
  }

  const reset = () => {
    setInputs({ ...defaults });
    setTouched({});
    setErrors({});
  }

  const validate = (name, value) =>  {
    const validator = validators[name];

    if (validator) {
      const result = validator(value)
      if (typeof result !== 'string') { // we're only interested in string error messages
        deleteError(name);
        return undefined; // return result for the onSubmit function
      } else {
        setError(name, result);
        return result; // return result for the onSubmit function
      }
    }
  }

  const onBlur = evt => {
    const { name, value } = evt.target;
    setTouch(name);
    validate(name, value);
  }

  const onChange = evt => {
    const { name, value } = evt.target;
    setInput(name, value);
    if (touched[name]) {
      validate(name, value);
    }
  }

  /**
   * @param {{
   *  name: string,
   *  defaultValue: string  
   *  validator?: (value: string) => string | undefined,
   * }} params
   */
  const register = ({ name, validator, defaultValue }) => {
    validators = { ...validators, [name]: validator };
    if (!(name in inputs) && typeof defaultValue !== 'undefined') { 
      setDefault(name, defaultValue);
      setInput(name, defaultValue); 
    } 

    return { onBlur, onChange, name, value: inputs[name] };
  }

  return { onSubmit, reset, register, inputs, errors, touched };
}

export default useSimpleForm;
