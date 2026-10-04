import { SignIn } from '@clerk/react'

function Login() {
  return (
    <div>
        <SignIn routing="hash"  signUpUrl="/register" fallbackRedirectUrl="/user-dashboard"/>
    </div>
  )
}

export default Login