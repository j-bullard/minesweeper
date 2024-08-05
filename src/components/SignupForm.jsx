'use client'

import { useFormState } from 'react-dom'
import PropTypes from 'prop-types'

export function SignupForm({ signupAction }) {
  const [state, formAction] = useFormState(signupAction, {})

  return (
    <>
      <form action={formAction}>
        <div>
          <label htmlFor='email'>Email</label>
          <input type='text' name='email' id='email' autoComplete='email' />
        </div>

        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            id='password'
            autoComplete='new-password'
          />
        </div>

        <button type='submit'>Signup</button>
      </form>

      {state.error && (
        <p>
          <strong>Error signing up: {state.error}</strong>
        </p>
      )}
    </>
  )
}

SignupForm.propTypes = {
  signupAction: PropTypes.func.isRequired,
}
