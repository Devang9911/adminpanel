import { PencilSquareIcon } from "@heroicons/react/24/solid";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Drawer from "../../common/Drawer";
import { useEffect, useState } from "react";
import PricingForm from "./PricingForm";
import FeaturesForm from "./FeaturesForm";
import { useDispatch, useSelector } from "react-redux";
import { getPlanById } from "../../../store/planSlice";
import Loader from "../../common/Loader";

function PlanDetails() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedPlan, loading } = useSelector((state) => state.plans);

  const [drawer, setDrawer] = useState({
    open: false,
    type: "",
    data: null,
  });

  useEffect(() => {
    if (planId) {
      dispatch(getPlanById({ planId }));
    }
  }, [planId, dispatch]);

  const closeDrawer = () => setDrawer({ open: false, type: "", data: null });

  const handleDeletePricing = (priceId) => {
    console.log("Delete pricing:", priceId);
  };

  const handleDeleteFeature = (feature) => {
    console.log("Delete feature:", feature);
  };

  if (!selectedPlan) return <Loader />;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <CreditCardIcon className="w-6 h-6 text-indigo-600" />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <span className="uppercase">{selectedPlan.plan_name}</span>
              <span>|</span>
              <span className="uppercase">{selectedPlan.product_name}</span>
              <span>|</span>
              <span className="uppercase">{selectedPlan.category_name}</span>

              <span
                className={`ml-3 px-3 text-sm rounded-xl ${
                  selectedPlan.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {selectedPlan.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Manage plan pricing and features
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex justify-between p-5 border-b">
          <h3 className="font-semibold">Billing Information</h3>

          <button
            onClick={() =>
              setDrawer({ open: true, type: "addPricing", data: null })
            }
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl"
          >
            <PlusIcon className="w-5 h-5" />
            Add Pricing
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Billing Cycle</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!selectedPlan.pricing || selectedPlan.pricing.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-400">
                  No pricing available
                </td>
              </tr>
            ) : (
              selectedPlan.pricing.map((price) => (
                <tr key={price.price_id} className="border-t">
                  <td className="p-4">{price.plan_billing_cycle}</td>
                  <td className="p-4">₹{price.plan_amount}</td>

                  <td className="p-4 text-center flex justify-center gap-4">
                    <button
                      onClick={() =>
                        setDrawer({
                          open: true,
                          type: "editPricing",
                          data: price,
                        })
                      }
                      className="group relative"
                    >
                      <PencilSquareIcon className="w-5 text-green-600" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                        Edit
                      </span>
                    </button>

                    <button
                      className="group relative"
                      onClick={() => handleDeletePricing(price.price_id)}
                    >
                      <TrashIcon className="w-5 text-red-600" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                        Delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex justify-between p-5 border-b">
          <h3 className="font-semibold">Features</h3>

          <button
            onClick={() =>
              setDrawer({ open: true, type: "addFeatures", data: null })
            }
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl"
          >
            <PlusIcon className="w-5 h-5" />
            Add Feature
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Feature</th>
              <th className="p-4 text-left">Value</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {selectedPlan.features.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-400">
                  No features available
                </td>
              </tr>
            ) : (
              selectedPlan.features.map((f, i) => (
                <tr key={`${f.feature_name}-${i}`} className="border-t">
                  <td className="p-4">{f.feature_name}</td>
                  <td className="p-4">{f.feature_value}</td>

                  <td className="p-4 text-center flex justify-center gap-4">
                    <button
                      onClick={() =>
                        setDrawer({
                          open: true,
                          type: "editFeature",
                          data: f,
                        })
                      }
                      className="group relative"
                    >
                      <PencilSquareIcon className="w-5 text-green-600" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                        Edit
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteFeature(f)}
                      className="group relative"
                    >
                      <TrashIcon className="w-5 text-red-600" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                        Delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Drawer
          open={drawer.open}
          onClose={closeDrawer}
          title={
            drawer.type === "addPricing"
              ? "Add Pricing"
              : drawer.type === "editPricing"
                ? "Edit Pricing"
                : drawer.type === "addFeatures"
                  ? "Add Feature"
                  : drawer.type === "editFeature"
                    ? "Edit Feature"
                    : ""
          }
        >
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
    </div>
  );
}

export default PlanDetails;
