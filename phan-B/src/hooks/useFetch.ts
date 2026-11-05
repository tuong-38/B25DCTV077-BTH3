import { useState, useEffect } from "react";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const INITIAL_DATA: Expense[] = [
  { id: "1", title: "Cơm sinh viên", amount: 35000, category: "Ăn uống", date: "2026-11-01" },
  { id: "2", title: "Vé xe bus tháng", amount: 100000, category: "Đi lại", date: "2026-11-02" },
  { id: "3", title: "Mua tai lieu", amount: 120000, category: "Học tập", date: "2026-11-03" },
];

export const useFetch = () => {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => {
      try {
        const local = localStorage.getItem("phan_b_expenses");
        setData(local ? JSON.parse(local) : INITIAL_DATA);
        setLoading(false);
      } catch (err) {
        setError("Lỗi tải dữ liệu!");
        setLoading(false);
      }
    }, 500);
  }, []);

  const addExpense = (newItem: Omit<Expense, "id">) => {
    const itemWithId = { ...newItem, id: Date.now().toString() };
    const updated = [itemWithId, ...data];
    setData(updated);
    localStorage.setItem("phan_b_expenses", JSON.stringify(updated));
  };

  const deleteExpense = (id: string) => {
    const updated = data.filter((item) => item.id !== id);
    setData(updated);
    localStorage.setItem("phan_b_expenses", JSON.stringify(updated));
  };

  return { data, loading, error, addExpense, deleteExpense };
};