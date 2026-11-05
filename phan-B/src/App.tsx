import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useClock } from "./hooks/useClock";
import { useFetch, Expense } from "./hooks/useFetch";

const CATEGORIES = ["Tất cả", "Ăn uống", "Đi lại", "Học tập", "Giải trí"];

const MainApp = () => {
  const { isDark, toggleTheme } = useTheme();
  const time = useClock();
  const { data: expenses, loading, error, addExpense, deleteExpense } = useFetch();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Ăn uống");
  const [date, setDate] = useState("");
  const [formError, setFormError] = useState("");

  const [filter, setFilter] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    document.title = `Tổng chi: ${total.toLocaleString("vi-VN")} VNĐ`;
  }, [expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !date) {
      setFormError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    addExpense({ title, amount: Number(amount), category, date });

    setTitle("");
    setAmount("");
    setDate("");
    setFormError("");

    inputRef.current?.focus();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có muốn xóa khoản chi này?")) {
      deleteExpense(id);
    }
  };

  const filteredList = expenses.filter((item) => {
    const matchCategory = filter === "Tất cả" || item.category === filter;
    const matchSearch = item.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalAmount = filteredList.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className={`app-container ${isDark ? "dark" : "light"}`}>
      <div className="card">
        {/* Header & Theme Switcher */}
        <div className="header">
          <h2>Sổ Chi Tiêu (Phần B - Hooks)</h2>
          <button onClick={toggleTheme} className="btn-theme">
            Chế độ: {isDark ? "Tối" : "Sáng"}
          </button>
        </div>

        <p>⏰ Đồng hồ: <strong>{time.toLocaleTimeString("vi-VN")}</strong></p>

        {loading && <p style={{ color: "orange" }}>Đang tải dữ liệu...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Form thêm */}
        <form onSubmit={handleSubmit} className="form-card">
          <h3>Thêm khoản chi mới</h3>
          {formError && <p style={{ color: "red" }}>{formError}</p>}
          <div className="form-grid">
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder="Nội dung"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Số tiền (VNĐ)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.filter((c) => c !== "Tất cả").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit" className="btn-submit">Thêm khoản chi</button>
          </div>
        </form>

        {/* Bộ lọc & Ô tìm kiếm */}
        <div className="controls-section">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm khoản chi (Debounced)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div>
            <strong>Lọc: </strong>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`btn-filter ${filter === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách */}
        <h3>Danh sách chi tiêu</h3>
        <ul className="expense-list">
          {filteredList.map((item) => (
            <li key={item.id} className="expense-item">
              <div>
                <strong>{item.title}</strong> [{item.category}]
                <br />
                <small>{item.date} • {Number(item.amount).toLocaleString("vi-VN")} VNĐ</small>
              </div>
              <button onClick={() => handleDelete(item.id)} className="btn-delete">Xóa</button>
            </li>
          ))}
        </ul>

        {/* Tổng tiền */}
        <div className="total-box">
          Tổng tiền: {totalAmount.toLocaleString("vi-VN")} VNĐ
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}