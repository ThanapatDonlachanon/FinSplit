"use client";

import React from "react";

export type Lang = "th" | "en";

type LabelMap = Record<string, { th: string; en: string }>;

export const LABELS: LabelMap = {
  save: { th: "บันทึก", en: "Save" },
  cancel: { th: "ยกเลิก", en: "Cancel" },
  done: { th: "เสร็จสิ้น", en: "Done" },
  next: { th: "ต่อไป", en: "Next" },
  skip: { th: "ข้าม", en: "Skip" },
  add: { th: "เพิ่ม", en: "Add" },
  all: { th: "ทั้งหมด", en: "All" },
  you: { th: "คุณ", en: "You" },
  update: { th: "อัปเดต", en: "Update" },
  deleteWord: { th: "ลบ", en: "Delete" },
  edit: { th: "แก้ไข", en: "Edit" },
  editWalletT: { th: "แก้ไขกระเป๋า", en: "Edit wallet" },
  editTxnT: { th: "แก้ไขรายการ", en: "Edit transaction" },
  editBillT: { th: "แก้ไขบิล", en: "Edit bill" },
  confirmDelete: { th: "แตะอีกครั้งเพื่อลบ", en: "Tap again to delete" },

  tabHome: { th: "หน้าแรก", en: "Home" },
  tabWallets: { th: "กระเป๋า", en: "Wallets" },
  tabGroups: { th: "กลุ่ม", en: "Groups" },
  tabProfile: { th: "โปรไฟล์", en: "Profile" },

  onbWelcomeT: { th: "ยินดีต้อนรับสู่ FinSplit", en: "Welcome to FinSplit" },
  onbWelcomeS: { th: "จัดการเงินส่วนตัว + หารค่าใช้จ่ายกับเพื่อน — ในแอปเดียว", en: "Personal finance + group splitting — in one app" },
  onbGetStarted: { th: "เริ่มเลย", en: "Get started" },
  onbWalletT: { th: "ติดตามทุกกระเป๋า", en: "Track every wallet" },
  onbWalletS: { th: "เพิ่มกระเป๋าเงินสด บัญชีธนาคาร บัตรเครดิต e-Wallet — ดูยอดรวมในที่เดียว", en: "Cash, bank, credit card, e-wallet — see your total in one place" },
  onbSplitT: { th: "หารบิลแบบไม่ต้องคิด", en: "Split bills without thinking" },
  onbSplitS: { th: "สร้างกลุ่ม → เพิ่มบิล → ระบบคำนวณว่าใครต้องโอนให้ใคร เท่าไหร่ น้อยครั้งที่สุด", en: "Create a group → add bills → we figure out who pays whom — with the fewest transfers" },
  onbStartUsing: { th: "เริ่มใช้งาน", en: "Start using" },

  homeHi: { th: "สวัสดี", en: "Hi" },
  homeNetWorth: { th: "ยอดเงินรวม · NET WORTH", en: "NET WORTH" },
  homeMoIn: { th: "เดือนนี้รับ", en: "Income this mo." },
  homeMoOut: { th: "เดือนนี้จ่าย", en: "Spent this mo." },
  expense: { th: "รายจ่าย", en: "Expense" },
  income: { th: "รายรับ", en: "Income" },
  transfer: { th: "ย้ายกระเป๋า", en: "Transfer" },
  drafts1: { th: "รายการรอยืนยัน", en: "drafts pending" },
  drafts2: { th: "จากการหารเงินกลุ่ม · Drafts from splits", en: "From group splits" },
  recent: { th: "กิจกรรมล่าสุด", en: "Recent activity" },
  emptyTxnT: { th: "ยังไม่มีรายการ", en: "No transactions yet" },
  emptyTxnS: { th: "แตะปุ่ม + ด้านล่างเพื่อบันทึก\nรายรับ–รายจ่ายแรกของคุณ", en: "Tap + below to record\nyour first transaction" },
  emptyTxnCta: { th: "เพิ่มรายการแรก", en: "Add first transaction" },
  byCategory: { th: "ใช้จ่ายตามหมวด", en: "Spending by category" },

  walletsT: { th: "กระเป๋าเงิน", en: "Wallets" },
  walletsSub: { th: "Wallets", en: "All your money" },
  walletsTotal: { th: "ยอดรวมทุกกระเป๋า", en: "Total across wallets" },
  emptyWalletT: { th: "เริ่มต้นด้วยกระเป๋าแรก", en: "Start with your first wallet" },
  emptyWalletS: { th: "สร้างกระเป๋าเงินสด, บัญชีธนาคาร, บัตรเครดิต — เลือกได้ตามที่คุณใช้จริง", en: "Cash, bank, credit card — track every source of money you actually use" },
  emptyWalletCta: { th: "สร้างกระเป๋า", en: "Create wallet" },
  addWallet: { th: "เพิ่มกระเป๋า", en: "Add wallet" },
  createWalletT: { th: "สร้างกระเป๋า", en: "Create wallet" },
  saveWallet: { th: "บันทึกกระเป๋า", en: "Save wallet" },
  walletNameP: { th: "เช่น SCB เงินเดือน", en: "e.g. Main checking" },

  amount: { th: "จำนวนเงิน", en: "Amount" },
  from: { th: "จาก", en: "From" },
  to: { th: "ไป", en: "To" },
  noWalletT: { th: "ยังไม่มีกระเป๋า", en: "No wallets yet" },
  noWalletS: { th: "สร้างกระเป๋าก่อนเพื่อบันทึกรายรับ–รายจ่าย", en: "Create a wallet first to record transactions" },
  noWalletCta: { th: "สร้างกระเป๋าก่อน", en: "Create wallet first" },
  attachReceipt: { th: "แนบใบเสร็จ", en: "Receipt" },
  today: { th: "วันนี้", en: "Today" },
  tag: { th: "แท็ก", en: "Tag" },

  budgetT: { th: "งบประมาณ", en: "Budget" },
  budgetSub: { th: "Monthly budgets", en: "Monthly limits" },
  emptyBudgetT: { th: "ตั้งงบประมาณรายเดือน", en: "Set monthly budgets" },
  emptyBudgetS: { th: "กำหนดเพดานการใช้จ่ายตามหมวด เพื่อไม่ให้ใช้เกินที่ตั้งใจ", en: "Cap your spending per category so you stay on track" },
  emptyBudgetCta: { th: "สร้างงบประมาณ", en: "Create budget" },
  budgetOver: { th: "เกิน", en: "Over by" },
  budgetLeft: { th: "เหลือ", en: "Left" },

  groupsT: { th: "กลุ่มหารเงิน", en: "Split groups" },
  groupsSub: { th: "Split sessions", en: "Bill-splitting sessions" },
  emptyGroupT: { th: "หารเงินกับเพื่อนง่ายๆ", en: "Splitting made easy" },
  emptyGroupS: { th: "สร้างกลุ่ม → เพิ่มบิล → ดูใครต้องโอนให้ใคร ลดจำนวนโอนเงินอัตโนมัติ", en: "Create a group → add bills → see who pays whom with the fewest transfers" },
  emptyGroupCta: { th: "สร้างกลุ่มใหม่", en: "Create new group" },
  haveInvite: { th: "มีลิงก์เชิญแล้ว? เข้าร่วม", en: "Got an invite link? Join" },
  bills: { th: "บิล", en: "bills" },
  membersWord: { th: "สมาชิก", en: "members" },
  youOwed: { th: "คุณรับ", en: "You'll receive" },
  youOwe: { th: "คุณต้องจ่าย", en: "You owe" },
  settledYou: { th: "จบแล้ว ✓", en: "Settled ✓" },

  createGroupT: { th: "สร้างกลุ่มใหม่", en: "Create new group" },
  groupNameLbl: { th: "ชื่อกลุ่ม · Session name", en: "Group name" },
  groupNameP: { th: "เช่น ทริปเชียงใหม่ มี.ค.", en: "e.g. Chiang Mai trip · Mar" },
  emojiLbl: { th: "ไอคอน · Emoji", en: "Emoji" },
  colorLbl: { th: "สี · Color", en: "Color" },
  memberCount: { th: "สมาชิก", en: "Members" },
  friendNameP: { th: "ชื่อเพื่อน · Friend’s name", en: "Friend’s name" },
  createInvite: { th: "สร้างและรับลิงก์เชิญ", en: "Create + get invite link" },
  groupCreated: { th: "สร้างกลุ่มสำเร็จ!", en: "Group created!" },
  sendLink: { th: "ส่งลิงก์ให้เพื่อนๆ เข้าร่วม", en: "Send the link so friends can join" },
  copy: { th: "Copy", en: "Copy" },
  copied: { th: "Copied", en: "Copied" },
  share: { th: "แชร์", en: "Share" },
  startNow: { th: "เริ่มเลย", en: "Start" },

  noBillT: { th: "ยังไม่มีบิล", en: "No bills yet" },
  noBillS: { th: "แตะ +เพิ่มบิล เพื่อบันทึกค่าใช้จ่ายแรก\nมีให้เลือก 3 แบบหาร", en: "Tap +Add Bill to record the first expense.\n3 split modes to choose from" },
  noBillCta: { th: "เพิ่มบิลแรก", en: "Add first bill" },
  billsHere: { th: "บิลในกลุ่ม", en: "Bills in this group" },
  addBill: { th: "เพิ่มบิล", en: "Add bill" },
  noBillsYet: { th: "ยังไม่มีบิล · เพิ่มบิลแรกเพื่อเริ่มหาร", en: "No bills yet · add the first one to start splitting" },
  youWillReceive: { th: "คุณจะได้รับ", en: "You'll receive" },
  youMustPay: { th: "คุณต้องจ่ายรวม", en: "You owe in total" },
  youSettled: { th: "คุณเสร็จแล้ว", en: "You're settled" },
  settledBadge: { th: "✓ ปิดบัญชี", en: "✓ Settled" },
  viewSettle: { th: "ดูแผนโอน", en: "Settle up" },
  paidWord: { th: "จ่าย", en: "paid" },

  pickModeT: { th: "เลือกวิธีหาร", en: "Choose split method" },
  modeEqualN: { th: "หารเท่ากัน", en: "Equal Split" },
  modeEqualD: { th: "1 คนจ่าย · หารเท่าทุกคน", en: "One payer · split evenly" },
  modeItemN: { th: "หารตามรายการ", en: "Item-based" },
  modeItemD: { th: "แยกแต่ละเมนู ใครสั่งอะไร", en: "Per-item assignment" },
  modeCustomN: { th: "หารไม่เท่า", en: "Custom Weight" },
  modeCustomD: { th: "กำหนดสัดส่วน % เอง", en: "Set your own ratios" },
  modeEqualS: { th: "หารเท่า", en: "Equal" },
  modeItemS: { th: "ตามรายการ", en: "Item-based" },
  modeCustomS: { th: "หารไม่เท่า", en: "Custom" },

  billNameLbl: { th: "ชื่อบิล · Name", en: "Bill name" },
  billNameP1: { th: "เช่น ข้าวเย็น", en: "e.g. Dinner" },
  billNameP2: { th: "เช่น ร้านอาหารญี่ปุ่น", en: "e.g. Sushi place" },
  billNameP4: { th: "เช่น ค่าทริป (หารตามวันพัก)", en: "e.g. Trip cost (by nights stayed)" },
  paidBy: { th: "ใครจ่าย · Paid by", en: "Paid by" },
  whoJoined: { th: "ใครร่วม", en: "Who joined" },
  perPerson: { th: "คนละ", en: "Per person" },
  saveBill: { th: "บันทึกบิล", en: "Save bill" },
  totalAmt: { th: "จำนวนเงินรวม · TOTAL", en: "TOTAL" },
  items: { th: "รายการอาหาร · Items", en: "Items" },
  itemNameP: { th: "ชื่อเมนู", en: "Item name" },
  addItem: { th: "เพิ่มรายการ", en: "Add item" },
  total: { th: "รวม", en: "Total" },
  unit: { th: "หน่วย · Unit", en: "Unit" },
  unitPct: { th: "เปอร์เซ็นต์ %", en: "Percent %" },
  unitAmt: { th: "จำนวนเงิน ฿", en: "Amount ฿" },
  weights: { th: "สัดส่วน · Weights", en: "Weights" },
  sumLabel: { th: "รวม", en: "Sum" },

  settleT: { th: "แผนการโอน", en: "Settlement plan" },
  settleSub: { th: "Settlement plan", en: "How to settle up" },
  reducedTo: { th: "ลดเหลือ", en: "Reduced to" },
  transfersWord: { th: "ครั้งโอน", en: "transfers" },
  reducedDesc: { th: "ระบบคำนวณเส้นทางโอนเงินที่น้อยที่สุดให้แล้ว", en: "We calculated the minimum-transfer plan for you" },
  netBalance: { th: "ยอดสุทธิ · Net balance", en: "NET BALANCE" },
  transfersHead: { th: "โอนเงิน · Transfers", en: "TRANSFERS" },
  noTransfer: { th: "ไม่ต้องโอน", en: "No transfer" },
  willReceive: { th: "รับเงิน", en: "Will receive" },
  willPay: { th: "จ่ายเงิน", en: "Will pay" },
  paidAlready: { th: "โอนแล้ว", en: "Paid" },
  allSettled: { th: "ทุกคนเสร็จแล้ว!", en: "Everyone's settled!" },
  closedT: { th: "ปิดบัญชีเรียบร้อย!", en: "All settled up!" },
  closedS: { th: "ส่งออกสรุปยอดเป็น PDF หรือเก็บไว้ดู", en: "Export as PDF or keep for records" },

  profileT: { th: "โปรไฟล์", en: "Profile" },
  profileSub: { th: "Profile", en: "Account & settings" },
  linkedAcct: { th: "เชื่อมต่อแล้ว · Linked account", en: "Linked account" },
  settingsHd: { th: "การตั้งค่า · Settings", en: "SETTINGS" },
  themeLbl: { th: "ธีมสี · Theme", en: "Color theme" },
  languageLbl: { th: "ภาษา · Language", en: "Language" },
  moreHd: { th: "ทั่วไป · General", en: "GENERAL" },
  menuCategories: { th: "หมวดหมู่", en: "Categories" },
  menuCurrency: { th: "สกุลเงิน", en: "Currency" },
  menuImport: { th: "นำเข้า CSV", en: "Import CSV" },
  menuNotifs: { th: "แจ้งเตือน", en: "Notifications" },
  menuHelp: { th: "ช่วยเหลือ", en: "Help & feedback" },
  menuCategoriesS: { th: "จัดการหมวดหมู่", en: "Manage categories" },
  menuCurrencyS: { th: "THB", en: "THB" },
  menuImportS: { th: "นำเข้าจาก Bank Statement", en: "Import from bank statement" },
  menuNotifsS: { th: "ปรับการแจ้งเตือน", en: "Notification preferences" },
  menuHelpS: { th: "ติดต่อทีม", en: "Contact support" },

  catFood: { th: "อาหาร", en: "Food" },
  catTransport: { th: "คมนาคม", en: "Transport" },
  catShop: { th: "ช้อปปิ้ง", en: "Shopping" },
  catFun: { th: "บันเทิง", en: "Fun" },
  catHealth: { th: "สุขภาพ", en: "Health" },
  catBills: { th: "บิล", en: "Bills" },
  catSalary: { th: "เงินเดือน", en: "Salary" },
  catFreelance: { th: "ฟรีแลนซ์", en: "Freelance" },

  loginT: { th: "ยินดีต้อนรับ", en: "Welcome" },
  loginS: { th: "ลงชื่อเข้าใช้เพื่อเริ่มต้น", en: "Login to get started" },

  usernamePromptT: { th: "ชื่อของคุณคืออะไร?", en: "What's your name?" },
  usernamePromptS: { th: "เราจะใช้ชื่อนี้เรียกคุณในแอป", en: "We'll use this to identify you in the app" },
  usernameField: { th: "ชื่อของคุณ", en: "Your name" },
  usernamePlaceholder: { th: "ชื่อ", en: "Name" },
  usernameConfirm: { th: "ยืนยัน", en: "Confirm" },

  accountT: { th: "บัญชี · Account", en: "Account" },
  accountSub: { th: "ชื่อผู้ใช้ และอีโมจิ", en: "Username and emoji" },
  editUsername: { th: "แก้ไขชื่อ", en: "Edit username" },
  pickEmoji: { th: "เปลี่ยนอีโมจิ", en: "Change emoji" },
  linkedAccountsT: { th: "บัญชีที่เชื่อมต่อ", en: "Linked Accounts" },
  noLinkedAccounts: { th: "ยังไม่มีบัญชีที่เชื่อมต่อ", en: "No linked accounts yet" },
  linkAccount: { th: "เชื่อมต่อบัญชี", en: "Link Account" },
  linkAnotherAccount: { th: "เชื่อมต่อบัญชีอื่น", en: "Link Another Account" },
  linked: { th: "เชื่อมต่อแล้ว", en: "Linked" },
  logout: { th: "ออกจากระบบ", en: "Logout" },
  loginLine: { th: "เข้าด้วย LINE", en: "Login with LINE" },
  loginGoogle: { th: "เข้าด้วย Google", en: "Login with Google" },

  emojiPickerT: { th: "เลือกอีโมจิ", en: "Pick emoji" },
  selectEmoji: { th: "แตะเพื่อเลือก", en: "Tap to select" },
};

export type L = Record<keyof typeof LABELS, string>;

export function makeL(lang: Lang): L {
  const out = {} as L;
  for (const k in LABELS) (out as Record<string, string>)[k] = LABELS[k][lang] ?? LABELS[k].th;
  return out;
}

export function catName(cat: { id?: string; name?: string } | undefined, L: L): string {
  if (!cat) return "—";
  const map: Record<string, keyof typeof LABELS> = {
    food: "catFood", transport: "catTransport", shop: "catShop", fun: "catFun",
    health: "catHealth", bills: "catBills", salary: "catSalary", freelance: "catFreelance",
  };
  const k = cat.id ? map[cat.id] : undefined;
  return k ? L[k] : cat.name || "—";
}

export function modeShort(mode: string, L: L): string {
  return ({ equal: L.modeEqualS, item: L.modeItemS, custom: L.modeCustomS } as Record<string, string>)[mode] || mode;
}

type LangValue = { L: L; lang: Lang };
const LangCtx = React.createContext<LangValue>({ L: makeL("th"), lang: "th" });

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const value = React.useMemo<LangValue>(() => ({ L: makeL(lang), lang }), [lang]);
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useL(): L { return React.useContext(LangCtx).L; }
export function useLang(): Lang { return React.useContext(LangCtx).lang; }
