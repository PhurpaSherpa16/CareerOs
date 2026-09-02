import { SignUp } from "@clerk/react";

function Register() {
  

  return (
    <div>
      <SignUp routing="path" path="/register" signInUrl="/login" fallbackRedirectUrl="/user-dashboard"/>
    </div>
  );
}

export default Register;