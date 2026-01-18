import { SignIn } from "@/components/clerk/SignIn";

export default function Index() {
  return (
    <SignIn scheme="ciana" signUpUrl="/sign-up" homeUrl="/(protected)" />
  );
}
