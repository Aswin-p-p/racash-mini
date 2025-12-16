import React, { useState } from "react";
import api from "../api";
import { connectMiniPay, sendCUSD } from "../utils/minipay";

const MERCHANT_WALLET = "0xYOUR_COMPANY_WALLET_ADDRESS"; // 🔴 replace this

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1️⃣ Connect MiniPay wallet (Opera only)
      await connectMiniPay();

      // 2️⃣ Send cUSD on Celo blockchain
      const txHash = await sendCUSD(MERCHANT_WALLET, amount);

      // 3️⃣ Notify backend to credit wallet
      await api.post("/deposit/webhook/", {
        ref: txHash,
        status: "SUCCESS",
      });

      setMessage("✅ Deposit successful! Your wallet will be updated shortly.");
      setAmount("");
    } catch (err) {
      setMessage(
        err.message || "❌ Deposit failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Deposit with MiniPay
        </h1>
        <p className="text-sm text-slate-500">
          Use Opera MiniPay to deposit cUSD directly into your R-Cash wallet.
        </p>
      </div>

      <form
        onSubmit={handleDeposit}
        className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4"
      >
        {message && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700">
            {message}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Amount (USD)
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50"
            placeholder="Enter amount in USD"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary-500 px-4 py-2 text-xs font-medium text-white hover:bg-primary-600 disabled:opacity-60"
        >
          {loading ? "Processing deposit..." : "Deposit with MiniPay"}
        </button>

        <p className="text-[11px] text-slate-400">
          ⚠️ This works only inside <strong>Opera MiniPay</strong>.
        </p>
      </form>
    </div>
  );
};

export default Deposit;
