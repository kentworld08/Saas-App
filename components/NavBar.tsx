import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import SideBar from "./SideBar";
const NavBar = async () => {
  const user = await currentUser();
  return (
    <header className="fixed top-0 left-0 right-0 shadow-2xl z-5 mb-10">
      <nav className="navbar">
        <Link href={"/"}>
          <div className="flex items-center gap-2.5 cursor-pointer">
            {user ? (
              <span className="font-semibold text-base sm:font-bold sm:text-xl">
                Welcome,&nbsp;{user.firstName}
              </span>
            ) : (
              <Image
                src={"/images/logo.svg"}
                alt="logo"
                width={46}
                height={44}
              />
            )}
          </div>
        </Link>
        <div className=" hidden sm:flex sm:items-center sm:gap-8 ">
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
        <SideBar />
      </nav>
    </header>
  );
};

export default NavBar;
