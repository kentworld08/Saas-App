import { SignIn } from "@clerk/nextjs";

const signIn = () => {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <SignIn />
    </main>
  );
};

export default signIn;
