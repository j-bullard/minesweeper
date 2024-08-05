'use client'

import { useFormState } from 'react-dom'
import PropTypes from 'prop-types'

export function LoginForm({ loginAction }) {
  const [state, formAction] = useFormState(loginAction, {})

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
            autoComplete='current-password'
          />
        </div>

        <button type='submit'>Login</button>
      </form>

      {state.error && (
        <p>
          <strong>Error logging in: {state.error}</strong>
        </p>
      )}
    </>
  )
}

LoginForm.propTypes = {
  loginAction: PropTypes.func.isRequired,
}
