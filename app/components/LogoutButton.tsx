'use client';

import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await logoutAction();
      }}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
    >
      Logout
    </button>
  );
}
