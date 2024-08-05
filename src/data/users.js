import 'server-only'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function createUser({ email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10)

  return await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  })
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { password: true },
  })
  if (!user) {
    throw new Error('User not found')
  }

  const validPassword = await bcrypt.compare(password, user.password.hash)
  if (!validPassword) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })

  return token
}
