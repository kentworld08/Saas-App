"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { navItems } from "./NavItems";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

const SideBar = () => {
  const pathname = usePathname();

  return (
    <Menubar className="sm:hidden">
      <MenubarMenu>
        <MenubarTrigger>
          <Menu />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem className="justify-self-start text-left items-start flex flex-col gap-4">
            {navItems.map(({ label, href }) => (
              <Link
                href={href}
                key={label}
                className={cn(
                  pathname === href && "text-primary font-semibold"
                )}
              >
                {label}
              </Link>
            ))}
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="justify-self-end">
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
          </MenubarItem>
          <MenubarSeparator />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default SideBar;
