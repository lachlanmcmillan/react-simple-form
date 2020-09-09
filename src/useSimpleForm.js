import React from 'react';

export const useForm = () => {
  let validators = {};
  const [inputs, setInputs] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const handleSubmit = (callback) => {
    return (evt) => {
      const form = evt.target;
      evt.preventDefault();

      let newErrors = {...errors}
      // check required
      Object.entries(validators).forEach(([name, validator]) => {
        const isRequired = form[name].required;
        if (!(name in inputs && typeof inputs[name] !== 'undefined')) { 
          // input is untouched
          if (isRequired) {
            newErrors[name] = 'required'
          }
        } 
      });

      setErrors(newErrors);

      const hasError = Object.entries(newErrors).reduce((prev, [name, val]) => {
        if (typeof val == 'string') return true;
        else return prev;
      }, false)
      
      if (!hasError) callback(inputs)
    }
  }

  // @param validateFn any string value is invalid 
  const register = (name, validateFn=(e) => true) => {
    validators = {
      ...validators,
      [name]: validateFn
    };

    // handleChange
    return (evt) => {
      const value = evt.target.value;
      // what about if the user sets the value to empty stirng?
      if (value.trim() !== '') {
        setInputs({
          ...inputs,
          [name]: value
        });

        const result = validateFn(value)
        setErrors({
          ...errors,
          [name]: result
        })
      } else {
        setInputs({
          ...inputs,
          [name]: undefined
        })
      }
    }
  }

  return { handleSubmit, register, errors, inputs };
}

export default useForm;