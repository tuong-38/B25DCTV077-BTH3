import React, { Component } from "react";
import "./App.css";

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const CATEGORIES = ["Tất cả", "Ăn uống", "Đi lại", "Học tập", "Giải trí"];

export default class App extends Component<any, any> {
  timerID: any = null;

  constructor(props: any) {
    super(props);
    // 1. Dữ liệu mẫu ban đầu
    this.state = {
      expenses: [
        { id: 1, title: "Ăn uống", amount: 30000, category: "Ăn uống", date: "2026-11-01" },
        { id: 2, title: "Vé xe bus tháng", amount: 100000, category: "Đi lại", date: "2026-11-02" },
        { id: 3, title: "Mua tài liệu", amount: 120000, category: "Học tập", date: "2026-11-03" },
        { id: 4, title: "Xem phim", amount: 90000, category: "Giải trí", date: "2026-11-04" },
      ],
      categoryFilter: "Tất cả",
      currentTime: new Date(),
      title: "",
      amount: "",
      category: "Ăn uống",
      date: "",
      error: "",
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState({ currentTime: new Date() });
    }, 1000);
    this.updateTitle();
  }

  componentDidUpdate(_prevProps: any, prevState: any) {
    if (prevState.expenses !== this.state.expenses) {
      this.updateTitle();
    }
  }

  componentWillUnmount() {
    if (this.timerID) clearInterval(this.timerID);
  }

  updateTitle = () => {
    const total = this.state.expenses.reduce((sum: number, item: Expense) => sum + item.amount, 0);
    document.title = `Tổng chi: ${total.toLocaleString("vi-VN")} VNĐ`;
  };

  handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, amount, category, date, expenses } = this.state;

    if (!title || !amount || !date) {
      this.setState({ error: "Vui lòng nhập đầy đủ thông tin!" });
      return;
    }

    const newItem: Expense = {
      id: Date.now(),
      title: title,
      amount: Number(amount),
      category: category,
      date: date,
    };

    this.setState({
      expenses: [newItem, ...expenses],
      title: "",
      amount: "",
      category: "Ăn uống",
      date: "",
      error: "",
    });
  };

  handleDelete = (id: number) => {
    if (window.confirm("Bạn có muốn xóa khoản chi này không?")) {
      this.setState({
        expenses: this.state.expenses.filter((item: Expense) => item.id !== id),
      });
    }
  };

  render() {
    const { expenses, categoryFilter, currentTime, title, amount, category, date, error } = this.state;

    const list = categoryFilter === "Tất cả"
      ? expenses
      : expenses.filter((item: Expense) => item.category === categoryFilter);

    const total = list.reduce((sum: number, item: Expense) => sum + item.amount, 0);

    return (
      <div className="container">
        {/* Header có đồng hồ */}
        <header className="header">
          <h2>Sổ Chi Tiêu Cá Nhân (Phần A)</h2>
          <div className="clock-badge">
            {currentTime.toLocaleTimeString("vi-VN")}
          </div>
        </header>

        {/* Form thêm */}
        <form onSubmit={this.handleAdd} className="form-card">
          <h3>Thêm khoản chi</h3>
          {error && <div className="error-msg">{error}</div>}
          
          <div className="form-grid">
            <input
              type="text"
              className="form-control"
              placeholder="Nội dung chi"
              value={title}
              onChange={(e) => this.setState({ title: e.target.value })}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Số tiền (VNĐ)"
              value={amount}
              onChange={(e) => this.setState({ amount: e.target.value })}
            />
            <select
              className="form-control"
              value={category}
              onChange={(e) => this.setState({ category: e.target.value })}
            >
              {CATEGORIES.filter((c) => c !== "Tất cả").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => this.setState({ date: e.target.value })}
            />
            <button type="submit" className="btn-submit">Thêm khoản chi</button>
          </div>
        </form>

        {/* Lọc loại */}
        <div className="filter-section">
          <span className="filter-title">Lọc:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => this.setState({ categoryFilter: cat })}
              className={`btn-filter ${categoryFilter === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Danh sách */}
        <h3>Danh sách chi tiêu ({categoryFilter})</h3>
        <ul className="expense-list">
          {list.map((item: Expense) => (
            <li key={item.id} className="expense-item">
              <div className="expense-info">
                <strong>{item.title}</strong>
                <span className="category-badge">{item.category}</span>
                <div className="expense-meta">
                  {item.date} • <strong>{item.amount.toLocaleString("vi-VN")} VNĐ</strong>
                </div>
              </div>
              <button onClick={() => this.handleDelete(item.id)} className="btn-delete">
                Xóa
              </button>
            </li>
          ))}
        </ul>

        {/* Tổng tiền */}
        <div className="total-card">
          <h3>Tổng tiền: {total.toLocaleString("vi-VN")} VNĐ</h3>
        </div>
      </div>
    );
  }
}