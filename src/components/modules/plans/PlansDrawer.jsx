import AddPlan from "./AddPlan";
import ViewPlan from "./ViewPlan";

export default function PlansDrawer({ open, onClose, type, data }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute right-0 top-0 h-full w-100 bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <h2 className="font-semibold text-lg capitalize">
              {type === "add" && "Add Plan"}
              {type === "edit" && "Edit Plan"}
              {type === "view" && "View Plan Details"}
            </h2>
            <button onClick={onClose}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {(type === "add" || type === "edit") && (
              <AddPlan
                editData={type === "edit" ? data : null}
                onClose={onClose}
              />
            )}

            {type === "view" && <ViewPlan data={data} />}
          </div>
        </div>
      </div>
    </div>
  );
}
