import { PencilSquareIcon } from "@heroicons/react/24/solid";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const sampleData = {
  planId: 1,
  planName: "Trial",
  isActive: true,
  categoryId: 1,
  productId: 1,
  productName: "SignalX",
  prices: [
    {
      priceId: 1,
      planId: 1,
      billingCycle: "monthly",
      amount: 0.0,
    },
    {
      priceId: 5,
      planId: 1,
      billingCycle: "15 days",
      amount: 100.0,
    },
  ],
  features: [
    {
      id: 1,
      planId: 1,
      featureId: 1,
      featureName: "chat per tabs",
      featureValue: "1",
    },
    {
      id: 2,
      planId: 1,
      featureId: 2,
      featureName: "Num of Tabs",
      featureValue: "1",
    },
    {
      id: 3,
      planId: 1,
      featureId: 3,
      featureName: "Indicator Per chart",
      featureValue: "2",
    },
    {
      id: 4,
      planId: 1,
      featureId: 4,
      featureName: "Data",
      featureValue: "Delayed",
    },
    {
      id: 23,
      planId: 1,
      featureId: 1,
      featureName: "chat per tabs",
      featureValue: "1",
    },
  ],
};

function PlanDetails() {
  const navigate = useNavigate();
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <CreditCardIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {sampleData.planName}
            </h1>
            <p className="text-sm text-gray-500">
              Manage plan pricing and features
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex justify-between items-center p-5 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-700">Pricing</h3>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition">
            <PlusIcon className="w-5 h-5" />
            Add Pricing
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4 text-left">Billing Cycle</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.prices.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center p-6 text-gray-400">
                    No pricing found
                  </td>
                </tr>
              )}
              {sampleData.prices.map((price) => (
                <tr
                  key={price.priceId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 capitalize">{price.billingCycle}</td>
                  <td className="p-4 font-medium text-gray-800">
                    ₹{price.amount}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <div className="relative group">
                        <button className="p-2 rounded-xl hover:bg-green-100 text-green-600 transition">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit
                        </span>
                      </div>
                      <div className="relative group">
                        <button className="p-2 rounded-xl hover:bg-red-100 text-red-600 transition">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Delete
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex justify-between items-center p-5 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-700">Features</h3>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition">
            <PlusIcon className="w-5 h-5" />
            Add Feature
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4 text-left">Feature</th>
                <th className="p-4 text-left">Value</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.features.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center p-6 text-gray-400">
                    No features found
                  </td>
                </tr>
              )}
              {sampleData.features.map((feature) => (
                <tr
                  key={feature.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 capitalize">{feature.featureName}</td>
                  <td className="p-4">{feature.featureValue}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <div className="relative group">
                        <button className="p-2 rounded-xl hover:bg-green-100 text-green-600 transition">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit
                        </span>
                      </div>

                      <div className="relative group">
                        <button className="p-2 rounded-xl hover:bg-red-100 text-red-600 transition">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Delete
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PlanDetails;
