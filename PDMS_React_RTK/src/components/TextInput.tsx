import React from "react";

interface TextInputProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number" | "email" | "password";
  error?: string;
  disabled?: boolean;
}

export const TextInput = ({
  name,
  label,
  value,
  onChange,
  type = "text",
  error,
  disabled = false,
}: TextInputProps) => (
  <div style={{ marginBottom: "15px" }}>
    <label
      style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: "4px",
        border: error ? "1px solid red" : "1px solid #ccc",
        boxSizing: "border-box",
        backgroundColor: disabled ? "#eee" : undefined,
      }}
    />
    {error && (
      <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
        {error}
      </div>
    )}
  </div>
);
