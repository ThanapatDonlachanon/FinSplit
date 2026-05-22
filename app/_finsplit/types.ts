export type Category = { id: string; name: string; icon: string; color: string; type: "expense" | "income" | "both" };

export type Wallet = { id: string; name: string; balance: number; color: string; icon: string };

export type TxType = "expense" | "income" | "transfer";
export type Transaction = {
  id: string;
  type: TxType;
  amount: number;
  walletId: string;
  categoryId: string | null;
  toWalletId?: string;
  note: string;
  date: string;
  status: "draft" | "confirmed";
};

export type Budget = { id: string; categoryId: string; limit: number };

export type Member = { id: string; name: string; color: string; isMe?: boolean };

export type BillShare = { memberId: string; amount: number };
export type BillItem = { name: string; price: number; sharers: string[] };
export type BillMode = "equal" | "item" | "custom";

export type Bill = {
  id: string;
  mode: BillMode;
  name: string;
  total: number;
  paidBy: string | { memberId: string; amount: number }[];
  shares: BillShare[];
  items?: BillItem[];
  icon: string;
  color: string;
};

export type SessionStatus = "active" | "settling" | "closed";

export type Session = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  myId: string;
  members: Member[];
  bills: Bill[];
  status: SessionStatus;
  currency: string;
  shareToken: string;
  createdAt: string;
};

export type LinkedAccount = { provider: "line" | "google"; id: string; name: string };

export type User = {
  id: string;
  username: string;
  emoji: string;
  linkedAccounts: LinkedAccount[];
};

export type Route =
  | { name: "login" }
  | { name: "usernamePrompt" }
  | { name: "tab" }
  | { name: "session"; id: string }
  | { name: "settle"; id: string };

export type Sheet =
  | { kind: "addWallet"; editId?: string }
  | { kind: "addTxn"; defaultType?: TxType; editId?: string }
  | { kind: "createSession" }
  | { kind: "addBill"; sessionId: string; editId?: string }
  | { kind: "editUsername" }
  | { kind: "emojiPicker" }
  | { kind: "linkAccount" }
  | null;

export type TabId = "home" | "wallets" | "groups" | "budget" | "profile";

export type AppState = {
  user: User | null;
  onboarded: boolean;
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  sessions: Session[];
  tab: TabId;
  route: Route;
  sheet: Sheet;
};

export type Nav = {
  openAddWallet: () => void;
  editWallet: (id: string) => void;
  openAddTxn: (type: TxType) => void;
  editTxn: (id: string) => void;
  openAddBudget: () => void;
  openCreateSession: () => void;
  openSession: (id: string) => void;
  openAddBill: (sessionId: string) => void;
  editBill: (sessionId: string, billId: string) => void;
  openSettle: () => void;
  backToGroups: () => void;
  backToSession: (id: string) => void;
  setTheme: (id: string) => void;
  setLang: (l: "th" | "en") => void;
  logout: () => void;
  openEditUsername: () => void;
  openEmojiPicker: () => void;
  openLinkAccount: () => void;
};
