import AddFeature from "./AddFeature";

export default function FeaturesDrawer({
  open,
  onClose,
  type,
  data,
  selectedProduct,
  selectedProductName,
}) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "visible" : "invisible"}`}>
      <div
        className={`absolute inset-0 bg-black/50 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute right-0 top-0 h-full w-100 bg-white shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <h2 className="font-semibold text-lg">
              {type === "edit" ? "Edit Feature" : "Add Feature"}
            </h2>
            <button onClick={onClose}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <AddFeature
              editData={data}
              selectedProduct={selectedProduct}
              selectedProductName={selectedProductName}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
