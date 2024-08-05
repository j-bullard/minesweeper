import { SignupForm } from '@/components/SignupForm'
import { signup } from '@/lib/authActions'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div>
      <SignupForm signupAction={signup} />
      <p>
        Already have an account? <Link href='/login'>Login</Link>
      </p>
    </div>
  )
}
