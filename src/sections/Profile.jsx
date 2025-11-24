// src/pages/Profile.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { getCurrentLevel, getNextLevel } from "../sections/Levels";
import {
  FaEdit,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaBolt,
  FaStar,
} from "react-icons/fa";
import ActivityFeed from "../sections/ActivityFeed";
import useActivity from "../hooks/useActivity";

/*
  Profile.jsx - Final playful UI with:
   - level + xp progress
   - achievements (badges)
   - realtime socket listeners for level up & activity
*/

const YEAR_OPTIONS = ["PUC-1", "PUC-2", "Engg-1", "Engg-2", "Engg-3", "Engg-4"];

const BRANCH_OPTIONS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "CHEM", "MME"];

const SOCKET_FALLBACK = (() => {
  // Prefer explicit socket url if provided
  const s = import.meta.env.VITE_SOCKET_URL;
  if (s && s.length) return s;
  // try deriving from API (strip /api if present)
  const api = import.meta.env.VITE_API_BASE || "";
  if (api.includes("/api")) return api.replace(/\/api.*$/, "");
  // last fallback to origin
  return typeof window !== "undefined" ? window.location.origin : "";
})();

const API = import.meta.env.VITE_API_BASE;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const activities = useActivity(user?._id);

  const [achievements, setAchievements] = useState([]);
  const [inlineEdit, setInlineEdit] = useState({
    name: false,
    mobile: false,
    year: false,
    branch: false,
  });

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    year: "",
    branch: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // init socket once user loads (so we can use user._id check)
  useEffect(() => {
    if (!SOCKET_FALLBACK) return;
    const s = io(SOCKET_FALLBACK, { transports: ["websocket", "polling"] });
    setSocket(s);

    s.on("connect", () => {
      // console.log("socket connected", s.id);
    });

    s.on("disconnect", () => {
      // console.log("socket disconnected");
    });

    return () => {
      try {
        s.disconnect();
      } catch (e) {}
    };
  }, []);

  // socket listeners for realtime notifications
  useEffect(() => {
    if (!socket) return;
    const onLevelUp = (payload) => {
      // payload: { userId, action, message, createdAt, ... }
      if (!user) return;
      // show toast if it's this user
      if (payload.userId === user._id || payload.userId === user?.id) {
        toast.success(payload.message || "Level up! ✨", {
          duration: 4000,
        });
        // fetch achievements & profile to refresh UI
        fetchAchievements();
        fetchProfile();
      } else {
        // optionally you can show global mini toast
        // toast(payload.message || "Someone leveled up!");
      }
    };

    const onActivity = (payload) => {
      // payload will be shown in ActivityFeed by useActivity hook (socket server also emits)
      // Optionally show small toast for important actions
      // e.g. show on bookmarks/uploads from this user
      if (!user) return;
      if (payload.userId === user._id || payload.userId === user?.id) {
        if (payload.action === "upload") {
          toast.success("Nice — resource uploaded! +10 points");
        }
      }
    };

    socket.on("level:up", onLevelUp);
    socket.on("activity:new", onActivity);

    return () => {
      socket.off("level:up", onLevelUp);
      socket.off("activity:new", onActivity);
    };
  }, [socket, user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setForm({
        name: res.data.name,
        mobile: res.data.mobile || "",
        year: res.data.year || "",
        branch: res.data.branch || "",
      });

      // fetch achievements after user loaded
      fetchAchievements();
    } catch (err) {
      console.error("fetchProfile err:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/achievements/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAchievements(res.data || []);
    } catch (err) {
      // silently fail (achievements optional)
      // console.error("fetch achievements err", err);
      setAchievements([]);
    }
  };

  const saveProfile = async (changed = null) => {
    const payload = changed || { ...form };
    try {
      setSaving(true);
      await axios.put(`${API}/users/update`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Profile Updated ✨");
      setEditing(false);
      setInlineEdit({ name: false, mobile: false, year: false, branch: false });
      fetchProfile();
    } catch (err) {
      console.error("saveProfile err:", err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const passwordStrength = useMemo(() => {
    const pw = passwords.newPassword;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return { score, max: 5 };
  }, [passwords.newPassword]);

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmPassword)
      return toast.error("Fill all fields!");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match!");

    try {
      await axios.put(
        `${API}/users/change-password`,
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Password updated 🔐");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("password change err", err);
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  if (loading) {
    return (
      <div className="pt-28 px-6 text-center font-semibold text-gray-600">
        Loading Profile…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-28 text-center">
        <p className="text-red-500">Unable to load profile.</p>
      </div>
    );
  }

  // Level calculations
  const currentLevel = getCurrentLevel(user.points || 0);
  const nextLevel = getNextLevel(user.points || 0);

  // compute progress % between current and next thresholds
  let progressPct = 100;
  if (nextLevel) {
    const currThresh = currentLevel.threshold || 0;
    const nextThresh = nextLevel.threshold || currThresh + 1;
    progressPct = Math.round(
      ((user.points - currThresh) / (nextThresh - currThresh)) * 100
    );
    if (progressPct < 0) progressPct = 0;
    if (progressPct > 100) progressPct = 100;
  }

  return (
    <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 p-8 rounded-2xl text-white shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="opacity-90 text-sm">{user.email}</p>
            <p className="mt-1 text-sm opacity-90">
              <b>College ID:</b> {user.collegeId}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase">Points</p>
            <p className="text-3xl font-bold flex items-center gap-2 justify-end">
              <FaBolt className="text-yellow-300" /> {user.points}
            </p>

            {/* Level chip */}
            <div className="mt-3 flex items-center justify-end gap-3">
              <LevelBadge level={currentLevel.key} name={currentLevel.name} />
              <div className="text-right text-xs opacity-90">
                <div>Level</div>
                <div className="font-semibold">{currentLevel.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-3 bg-white/20 rounded-lg overflow-hidden">
                <div
                  className="h-3 bg-white rounded-lg transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="text-xs mt-1 flex justify-between opacity-90">
                <span>{user.xp ?? 0} XP</span>
                {nextLevel ? (
                  <span>
                    {progressPct}% to {nextLevel.name}
                  </span>
                ) : (
                  <span>Max level</span>
                )}
              </div>
            </div>
            <div className="w-24 text-right text-xs">
              <div className="font-semibold">
                {user.level ?? currentLevel.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* PROFILE CARD */}
          <div className="bg-white shadow-md p-6 rounded-xl border">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Profile Info</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded-full flex items-center gap-2"
              >
                <FaEdit /> {editing ? "Editing" : "Edit"}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NAME */}
              <FieldRow
                label="Name"
                value={form.name}
                field="name"
                inlineEdit={inlineEdit}
                setInlineEdit={setInlineEdit}
                editing={editing}
                form={form}
                setForm={setForm}
                original={user.name}
                saveProfile={saveProfile}
              />

              {/* MOBILE */}
              <FieldRow
                label="Mobile"
                value={form.mobile || "Not added"}
                field="mobile"
                inlineEdit={inlineEdit}
                setInlineEdit={setInlineEdit}
                editing={editing}
                form={form}
                setForm={setForm}
                original={user.mobile || ""}
                saveProfile={saveProfile}
              />

              {/* YEAR */}
              <FieldRow
                label="Year"
                value={form.year || "Not set"}
                field="year"
                inlineEdit={inlineEdit}
                setInlineEdit={setInlineEdit}
                editing={editing}
                form={form}
                setForm={setForm}
                original={user.year || ""}
                saveProfile={saveProfile}
                selectOptions={YEAR_OPTIONS}
              />

              {/* BRANCH */}
              <FieldRow
                label="Branch"
                value={form.branch || "Not set"}
                field="branch"
                inlineEdit={inlineEdit}
                setInlineEdit={setInlineEdit}
                editing={editing}
                form={form}
                setForm={setForm}
                original={user.branch || ""}
                saveProfile={saveProfile}
                selectOptions={BRANCH_OPTIONS}
              />
            </div>

            {editing && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => saveProfile()}
                  className="px-5 py-2 bg-cyan-600 text-white rounded-lg"
                >
                  Save All
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setInlineEdit({
                      name: false,
                      mobile: false,
                      year: false,
                      branch: false,
                    });
                    setForm({
                      name: user.name,
                      mobile: user.mobile || "",
                      year: user.year || "",
                      branch: user.branch || "",
                    });
                  }}
                  className="px-5 py-2 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* PASSWORD CARD */}
          <div className="bg-white shadow-md p-6 rounded-xl border">
            <h2 className="font-semibold text-lg mb-3">Security</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* OLD PASSWORD */}
              <InputBlock
                label="Old Password"
                type="password"
                value={passwords.oldPassword}
                onChange={(val) =>
                  setPasswords({ ...passwords, oldPassword: val })
                }
              />

              {/* NEW PASSWORD */}
              <InputBlock
                label="New Password"
                type={showPwd ? "text" : "password"}
                value={passwords.newPassword}
                onChange={(val) =>
                  setPasswords({ ...passwords, newPassword: val })
                }
                addon={
                  <button
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-2"
                  >
                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
              />

              {/* CONFIRM PASSWORD */}
              <InputBlock
                label="Confirm Password"
                type={showPwd ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={(val) =>
                  setPasswords({ ...passwords, confirmPassword: val })
                }
              />
            </div>

            {/* PASSWORD STRENGTH */}
            <div className="mt-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    passwordStrength.score >= 4
                      ? "bg-emerald-500"
                      : passwordStrength.score >= 2
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width:
                      (passwordStrength.score / passwordStrength.max) * 100 +
                      "%",
                  }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Strength:{" "}
                {passwordStrength.score >= 4
                  ? "Strong"
                  : passwordStrength.score >= 2
                  ? "Medium"
                  : "Weak"}
              </p>
            </div>

            <button
              onClick={handlePasswordChange}
              className="mt-4 px-5 py-2 bg-emerald-500 text-white rounded-lg"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          <ActivityFeed activities={activities} />

          {/* Horizontal Badges Section */}
          <div className="bg-white p-5 rounded-xl shadow-md border">
            <h2 className="font-semibold mb-3">Badges</h2>

            <div className="flex items-center gap-4 overflow-x-auto py-2">
              {[
                { key: "starter", name: "Starter", points: 0 },
                { key: "bronze", name: "Bronze", points: 200 },
                { key: "silver", name: "Silver", points: 600 },
                { key: "gold", name: "Gold", points: 1200 },
                { key: "legend", name: "Legend", points: 2500 },
              ].map((badge) => {
                const unlocked = (user?.points || 0) >= badge.points;

                return (
                  <div
                    key={badge.key}
                    className={`min-w-[130px] flex flex-col items-center justify-center
            p-4 rounded-xl border shadow-sm
            ${
              unlocked
                ? "bg-green-50 border-green-300"
                : "bg-gray-50 border-gray-200"
            }
          `}
                  >
                    <BadgeIcon levelKey={badge.key} className="w-10 h-10" />

                    <p className="font-semibold text-gray-800 mt-2 text-sm">
                      {badge.name}
                    </p>

                    <p className="text-xs text-gray-500">{badge.points} XP</p>

                    {unlocked ? (
                      <span className="text-green-600 text-xs font-medium mt-1">
                        ✔ Unlocked
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs mt-1">Locked</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* FLOATING SAVE BUTTON */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => saveProfile()}
          className="bg-cyan-600 text-white px-5 py-3 rounded-full shadow-xl hover:scale-105 transition"
        >
          <FaCheck className="inline-block mr-2" />
          Save
        </button>
      </div>
    </div>
  );
};

/* ---------------- Components ---------------- */

const FieldRow = ({
  label,
  value,
  field,
  inlineEdit,
  setInlineEdit,
  editing,
  form,
  setForm,
  original,
  saveProfile,
  selectOptions,
}) => {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>

      {!editing || !inlineEdit[field] ? (
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
          <span>{value}</span>
          {editing && (
            <button
              onClick={() => setInlineEdit({ ...inlineEdit, [field]: true })}
              className="text-cyan-600 text-xs px-2 py-1 bg-cyan-50 rounded-full"
            >
              Edit
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          {selectOptions ? (
            <select
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select</option>
              {selectOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg"
            />
          )}

          <button
            onClick={() => saveProfile({ [field]: form[field] })}
            className="px-3 py-1 bg-emerald-500 text-white rounded-lg"
          >
            Save
          </button>

          <button
            onClick={() => {
              setInlineEdit({ ...inlineEdit, [field]: false });
              setForm({ ...form, [field]: original });
            }}
            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const InputBlock = ({ label, type, value, onChange, addon }) => (
  <div>
    <label className="text-sm mb-1 block">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />
      {addon}
    </div>
  </div>
);

/* ---------------- Badge & Level UI helpers ---------------- */

const LevelBadge = ({ level = "starter", name = "Starter" }) => {
  // small colorful capsule
  const styles = {
    starter: "bg-white/20 text-white",
    bronze: "bg-amber-500 text-white",
    silver: "bg-slate-300 text-black",
    gold: "bg-yellow-400 text-black",
    legend: "bg-purple-600 text-white",
  };
  return (
    <div
      className={`px-3 py-1 rounded-full flex items-center gap-2 text-sm font-semibold ${styles[level]}`}
    >
      <FaStar className="text-sm" />
      <span>{name}</span>
    </div>
  );
};

const BadgeIcon = ({ levelKey }) => {
  switch (levelKey) {
    case "bronze":
      return <BronzeSVG />;
    case "silver":
      return <SilverSVG />;
    case "gold":
      return <GoldSVG />;
    case "legend":
      return <LegendSVG />;
    default:
      return <StarterSVG />;
  }
};

const StarterSVG = () => (
  <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600">
    <FaStar />
  </div>
);
const BronzeSVG = () => (
  <div
    className="w-12 h-12 rounded-full flex items-center justify-center"
    style={{ background: "linear-gradient(135deg,#cd7f32,#b87333)" }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l2.4 6.2L21 9l-5 3.6L17.8 19 12 15.9 6.2 19 7 12.6 2 9l6.6-0.8L12 2z"
        fill="#fff"
      />
    </svg>
  </div>
);
const SilverSVG = () => (
  <div
    className="w-12 h-12 rounded-full flex items-center justify-center"
    style={{ background: "linear-gradient(135deg,#cfcfcf,#9ea0a2)" }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l2.4 6.2L21 9l-5 3.6L17.8 19 12 15.9 6.2 19 7 12.6 2 9l6.6-0.8L12 2z"
        fill="#fff"
      />
    </svg>
  </div>
);
const GoldSVG = () => (
  <div
    className="w-12 h-12 rounded-full flex items-center justify-center"
    style={{ background: "linear-gradient(135deg,#ffd54a,#f9a825)" }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l2.4 6.2L21 9l-5 3.6L17.8 19 12 15.9 6.2 19 7 12.6 2 9l6.6-0.8L12 2z"
        fill="#fff"
      />
    </svg>
  </div>
);
const LegendSVG = () => (
  <div
    className="w-12 h-12 rounded-full flex items-center justify-center"
    style={{ background: "linear-gradient(135deg,#b388ff,#7c4dff)" }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l2.4 6.2L21 9l-5 3.6L17.8 19 12 15.9 6.2 19 7 12.6 2 9l6.6-0.8L12 2z"
        fill="#fff"
      />
    </svg>
  </div>
);

export default Profile;
