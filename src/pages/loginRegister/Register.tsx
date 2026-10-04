import { SignUp } from "@clerk/react";

function Register() {
  return (
    <div>
      <SignUp routing="hash" signInUrl="/login" fallbackRedirectUrl="/user-dashboard"/>
    </div>
  );
}

export default Register;