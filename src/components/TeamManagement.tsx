import { useState } from "react";
import { useAdmin } from "../contexts/AdminContext";

interface TeamManagementProps {
  onClose: () => void;
}

export default function TeamManagement({ onClose }: TeamManagementProps) {
  const {
    currentAdmin,
    adminTeam,
    isSuperAdmin,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    checkPermission,
  } = useAdmin();

  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    designation: "",
    role: "coordinator" as "super_admin" | "admin" | "manager" | "coordinator",
  });

  const roles = [
    {
      id: "coordinator",
      label: "Coordinator",
      description: "Basic data access and reports",
    },
    {
      id: "manager",
      label: "Manager",
      description: "Manage assigned users and data",
    },
    {
      id: "admin",
      label: "Admin",
      description: "Full user management and analytics",
    },
    ...(isSuperAdmin
      ? [
          {
            id: "super_admin",
            label: "Super Admin",
            description: "Complete system control",
          },
        ]
      : []),
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      designation: "",
      role: "coordinator",
    });
    setShowAddMember(false);
    setEditingMember(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission("manage_team")) {
      alert("You do not have permission to manage team members");
      return;
    }

    setIsLoading(true);

    try {
      let success = false;

      if (editingMember) {
        success = await updateTeamMember(editingMember, {
          ...formData,
          isActive: true,
        });
      } else {
        success = await addTeamMember({
          ...formData,
          permissions: [],
          isActive: true,
        });
      }

      if (success) {
        resetForm();
        alert(
          editingMember
            ? "Team member updated successfully!"
            : "Team member added successfully!",
        );
      } else {
        alert(
          "Failed to save team member. Please check all fields and try again.",
        );
      }
    } catch (error) {
      console.error("Error saving team member:", error);
      alert("An error occurred while saving the team member.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (member: any) => {
    setFormData({
      name: member.name,
      phone: member.phone,
      email: member.email || "",
      designation: member.designation,
      role: member.role,
    });
    setEditingMember(member.id);
    setShowAddMember(true);
  };

  const handleRemove = async (memberId: string) => {
    if (!isSuperAdmin) {
      alert("Only super admin can remove team members");
      return;
    }

    if (confirm("Are you sure you want to remove this team member?")) {
      setIsLoading(true);
      const success = await removeTeamMember(memberId);
      if (success) {
        alert("Team member removed successfully!");
      } else {
        alert("Failed to remove team member.");
      }
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "manager":
        return "bg-green-100 text-green-800";
      case "coordinator":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Team Management</h2>
              <p className="text-blue-100">
                Manage your healthcare team members
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-bold w-10 h-10 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Admin Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {currentAdmin?.name?.charAt(0) || "A"}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {currentAdmin?.name}
                </h3>
                <p className="text-gray-600">{currentAdmin?.designation}</p>
                <p className="text-sm text-gray-500">{currentAdmin?.phone}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getRoleColor(currentAdmin?.role || "")}`}
                >
                  {currentAdmin?.role?.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Add Member Button */}
          {checkPermission("manage_team") && !showAddMember && (
            <div className="mb-6">
              <button
                onClick={() => setShowAddMember(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Add Team Member</span>
              </button>
            </div>
          )}

          {/* Add/Edit Member Form */}
          {showAddMember && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {editingMember
                  ? "✏️ Edit Team Member"
                  : "➕ Add New Team Member"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation *
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                      placeholder="e.g., Program Coordinator, Field Manager"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role & Permissions *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roles.map((role) => (
                      <label
                        key={role.id}
                        className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.role === role.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.id}
                          checked={formData.role === role.id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              role: e.target.value as any,
                            })
                          }
                          className="mt-1 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-800">
                            {role.label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {role.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    {isLoading
                      ? "Saving..."
                      : editingMember
                        ? "Update Member"
                        : "Add Member"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Team Members List */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              👥 Team Members ({adminTeam.length})
            </h3>

            {adminTeam.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-gray-600 mb-2">No team members added yet</p>
                <p className="text-sm text-gray-500">
                  Add your first team member to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminTeam.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex space-x-2">
                        {checkPermission("manage_team") && (
                          <button
                            onClick={() => handleEdit(member)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            ✏️
                          </button>
                        )}
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleRemove(member.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {member.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {member.designation}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        {member.phone}
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(member.role)}`}
                        >
                          {member.role.replace("_", " ").toUpperCase()}
                        </span>
                        <span
                          className={`w-3 h-3 rounded-full ${member.isActive ? "bg-green-500" : "bg-red-500"}`}
                          title={member.isActive ? "Active" : "Inactive"}
                        ></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
