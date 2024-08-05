import { LoginForm } from '@/components/LoginForm'
import { login } from '@/lib/authActions'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <>
      <LoginForm loginAction={login} />
      <p>
        Don't have an account? <Link href='/signup'>Signup</Link>
      </p>
    </>
  )
}
