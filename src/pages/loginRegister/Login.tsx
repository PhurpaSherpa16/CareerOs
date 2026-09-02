import { SignIn } from '@clerk/react'

function Login() {
  return (
    <div>
        <SignIn routing="path" path="/login" signUpUrl="/register" fallbackRedirectUrl="/user-dashboard"/>
    </div>
  )
}

export default Login