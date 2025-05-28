import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
const NavBar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 shadow-2xl z-5 mb-10">
      <nav className="navbar">
        <Link href={"/"}>
          <div className="flex items-center gap-2.5 cursor-pointer">
            <Image src={"/images/logo.svg"} alt="logo" width={46} height={44} />
          </div>
        </Link>
        <div className="flex items-center gap-8">
          <NavItems />
          <SignedOut>
            <SignInButton>
              <button type="button" className="btn-signin">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
