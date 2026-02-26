import ClientSignIn from "./ClientSignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn Page",
  description: "This is Signin Page",
};

export default function SignIn() {
  return <ClientSignIn />;
}
