export default function Input({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-soft text-xs font-body mb-2 uppercase tracking-widest">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white font-body text-sm
          focus:border-accent transition-colors placeholder:text-muted" />
    </div>
  );
}
