import {
  CheckBadgeIcon,
  CurrencyRupeeIcon,
  FolderIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import StatsBox from "../../components/common/StatsBox";
import { getDashboardSummary } from "../../store/dashboardSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { summary, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardSummary());
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsBox
          value={summary?.totalUsers || 0}
          title="Total Users"
          icon={UsersIcon}
          color="bg-blue-500"
          onClick={() => navigate("/users")}
        />

        <StatsBox
          value={summary?.totalWorkspaces || 0}
          title="Workspaces"
          icon={FolderIcon}
          color="bg-yellow-500"
          onClick={() => navigate("/workspaces")}
        />

        <StatsBox
          value={summary?.activeSubscriptions || 0}
          title="Active Subscriptions"
          icon={CheckBadgeIcon}
          color="bg-green-500"
        />

        <StatsBox
          value={`₹ ${summary?.totalRevenue || 0}`}
          title="Total Revenue"
          icon={CurrencyRupeeIcon}
          color="bg-orange-500"
        />
      </div>
    </div>
  );
}

export default Dashboard;
