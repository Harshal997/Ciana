import { SignUp } from "@/components/clerk/SignUp";
import React from "react";

const signUp = () => {
  return <SignUp signInUrl="/" scheme="ciana" homeUrl="/(protected)" />;
};

export default signUp;
