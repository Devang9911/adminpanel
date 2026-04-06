import AddModules from "./AddModules";

export default function ModuleDrawer({ open, onClose, type, data }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "visible" : "invisible"}`}>
      <div
        className={`absolute inset-0 bg-black/60 transition ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute right-0 top-0 h-full w-110 bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold capitalize">{type} Module</h2>
            <button onClick={onClose}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <AddModules
              mode={type}
              defaultData={data}
              setToggleForm={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
