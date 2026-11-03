export const ADMIN = {
   id: 1,
   email: 'admin@example.com',
   name: 'Admin',
   password: 'password',
}

const { password: _password, ...PUBLIC_USER } = ADMIN
export { PUBLIC_USER }

export const INVALID_EMAIL = 'not-an-email'
export const WRONG_PASSWORD = 'wrong-password'