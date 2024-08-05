'use server'

import { createUser, loginUser } from '@/data/users'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const { z } = require('zod')

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function signup(_prevState, formData) {
  const validatedFields = FormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data',
    }
  }

  const { email, password } = validatedFields.data

  try {
    await createUser({ email, password })
  } catch (err) {
    return { error: err.message }
  }

  redirect('/')
}

export async function login(_prevState, formData) {
  const validatedFields = FormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data',
    }
  }

  const { email, password } = validatedFields.data
  let token

  try {
    token = await loginUser({ email, password })
  } catch (err) {
    return { error: err.message }
  }

  cookies().set({
    name: 'token',
    value: token,
    path: '/',
    maxAge: 60 * 60 * 24,
    secure: true,
    httpOnly: true,
  })

  redirect('/')
}

export async function logout() {
  cookies().delete('token')

  redirect('/login')
}
