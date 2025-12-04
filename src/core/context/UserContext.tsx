import React, { createContext, useContext, useState } from "react";

export interface AccountProfile {
  id: string;
  name: string;
  // avatar can be a remote URI (string) or a local require() (number) or null
  avatar: string | number | null;
  // whether this account is currently selected (UI convenience)
  isSelected: boolean;
}

interface UserContextValue {
  // lightweight global user view (kept in sync with active account)
  user: { name: string };
  setUser: (u: { name: string }) => void;

  // accounts and active account management
  accounts: AccountProfile[];
  setAccounts: (next: AccountProfile[] | ((prev: AccountProfile[]) => AccountProfile[])) => void;
  activeAccountId: string | null;
  setActiveAccountId: (id: string) => void;
  updateAccount: (id: string, patch: Partial<AccountProfile>) => void;
  // role: 'organizer' | 'assistant'
  role: "organizer" | "assistant";
  setRole: (r: "organizer" | "assistant") => void;
}

// Default accounts: one personal, one organization. Avatar for org uses splash asset.
const splash = require("@/src/core/assets/splash-icon.png");
const defaultAccounts: AccountProfile[] = [
  { id: "1", name: "Joe Doe", avatar: require("@/src/modules/home/assets/ProfilePhoto.png"), isSelected: true },
  { id: "2", name: "Llajtazo Events", avatar: splash, isSelected: false },
];

const defaultUser = { name: defaultAccounts[0].name };

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string }>(defaultUser);

  const [accounts, setAccounts] = useState<AccountProfile[]>(defaultAccounts);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(defaultAccounts[0].id);
  const [role, setRole] = useState<"organizer" | "assistant">("organizer");

  const setActiveAccount = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    if (acc) {
      setActiveAccountId(id);
      // update accounts' isSelected flags so UIs like SwitchAccountTab reflect selection
      setAccounts((prev) => prev.map((a) => ({ ...a, isSelected: a.id === id })));
      // keep lightweight user view in sync (so existing code reading `user.name` still works)
      setUser({ name: acc.name });
    }
  };

  const updateAccount = (id: string, patch: Partial<AccountProfile>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    // if we updated the active account's name, reflect it in user
    if (activeAccountId === id && patch.name) setUser({ name: patch.name });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        accounts,
        setAccounts,
        activeAccountId,
        setActiveAccountId: setActiveAccount,
        updateAccount,
        role,
        setRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}

export default UserContext;
