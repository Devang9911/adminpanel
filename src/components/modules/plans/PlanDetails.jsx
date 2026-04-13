import { PencilSquareIcon } from "@heroicons/react/24/solid";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getPlanById } from "../../../store/planSlice";
import Drawer from "../../common/Drawer";
import Loader from "../../common/Loader";
import FeaturesForm from "./FeaturesForm";
import PricingForm from "./PricingForm";

function PlanDetails() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedPlan, loading } = useSelector((state) => state.plans);
  const [drawer, setDrawer] = useState({ open: false, type: "", data: null });

  useEffect(() => {
    if (planId) dispatch(getPlanById({ planId }));
  }, [planId, dispatch]);

  const closeDrawer = () => setDrawer({ open: false, type: "", data: null });

  if (!selectedPlan || loading) return <Loader />;

  const drawerTitle =
    {
      addPricing: "Add pricing",
      editPricing: "Edit pricing",
      addFeatures: "Add feature",
      editFeature: "Edit feature",
    }[drawer.type] || "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <CreditCardIcon className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-800 uppercase">
                {selectedPlan.plan_name}
              </span>
              <span className="text-gray-200 text-xs">|</span>
              <span className="text-xs font-medium text-gray-500 uppercase">
                {selectedPlan.product_name}
              </span>
              <span className="text-gray-200 text-xs">|</span>
              <span className="text-xs font-medium text-gray-500 uppercase">
                {selectedPlan.category_name}
              </span>
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ring-1 ${
                  selectedPlan.is_active
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-gray-100 text-gray-500 ring-gray-200"
                }`}
              >
                {selectedPlan.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Manage plan pricing and features
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">
            Billing information
          </h3>
          <button
            onClick={() =>
              setDrawer({ open: true, type: "addPricing", data: null })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-3.5 h-3.5" /> Add pricing
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Billing cycle
                </th>
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-center px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!selectedPlan.pricing || selectedPlan.pricing.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-10 text-gray-300 text-xs"
                  >
                    No pricing available
                  </td>
                </tr>
              ) : (
                selectedPlan.pricing.map((price) => (
                  <tr
                    key={price.price_id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-xs font-medium text-gray-700 capitalize">
                      {price.plan_billing_cycle}
                    </td>
                    <td className="px-6 py-3.5 text-xs font-semibold text-gray-800">
                      ₹{price.plan_amount}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-center items-center gap-1">
                        <button
                          onClick={() =>
                            setDrawer({
                              open: true,
                              type: "editPricing",
                              data: price,
                            })
                          }
                          className="relative p-1.5 rounded-lg hover:bg-blue-50 transition-colors group/btn"
                        >
                          <PencilSquareIcon className="w-4 h-4 text-blue-400 group-hover/btn:text-blue-600" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                            Edit
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            console.log("Delete pricing:", price.price_id)
                          }
                          className="relative p-1.5 rounded-lg hover:bg-red-50 transition-colors group/btn"
                        >
                          <TrashIcon className="w-4 h-4 text-red-400 group-hover/btn:text-red-600" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                            Delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold text-gray-800">Features</h3>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {selectedPlan.features.length}
            </span>
          </div>
          <button
            onClick={() =>
              setDrawer({ open: true, type: "addFeatures", data: null })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-3.5 h-3.5" /> Add feature
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Feature
                </th>
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="text-center px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {selectedPlan.features.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-10 text-gray-300 text-xs"
                  >
                    No features available
                  </td>
                </tr>
              ) : (
                selectedPlan.features.map((f, i) => (
                  <tr
                    key={`${f.feature_name}-${i}`}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-xs font-medium text-gray-700">
                      {f.feature_name}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">
                      {f.feature_value}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-center items-center gap-1">
                        <button
                          onClick={() =>
                            setDrawer({
                              open: true,
                              type: "editFeature",
                              data: f,
                            })
                          }
                          className="relative p-1.5 rounded-lg hover:bg-blue-50 transition-colors group/btn"
                        >
                          <PencilSquareIcon className="w-4 h-4 text-blue-400 group-hover/btn:text-blue-600" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                            Edit
                          </span>
                        </button>
                        <button
                          onClick={() => console.log("Delete feature:", f)}
                          className="relative p-1.5 rounded-lg hover:bg-red-50 transition-colors group/btn"
                        >
                          <TrashIcon className="w-4 h-4 text-red-400 group-hover/btn:text-red-600" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                            Delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer open={drawer.open} onClose={closeDrawer} title={drawerTitle}>
        {drawer.type === "addPricing" && (
          <PricingForm planId={planId} onClose={closeDrawer} />
        )}
        {drawer.type === "editPricing" && (
          <PricingForm
            planId={planId}
            editData={drawer.data}
            onClose={closeDrawer}
          />
        )}
        {drawer.type === "addFeatures" && (
          <FeaturesForm
            planId={planId}
            productId={selectedPlan.product_id} 
            onClose={closeDrawer}
          />
        )}
        {drawer.type === "editFeature" && (
          <FeaturesForm
            planId={planId}
            productId={selectedPlan.product_id}
            editData={drawer.data}
            onClose={closeDrawer}
          />
        )}
      </Drawer>
    </div>
  );
}

export default PlanDetails;
