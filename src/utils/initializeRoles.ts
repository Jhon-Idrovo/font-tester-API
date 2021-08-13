import Role from "../models/Role";

export default async function initializeRoles() {
  try {
    const roles = await Role.countDocuments();
    if (roles > 0) return;

    const adminRole = new Role({ name: "Admin" });
    const userRole = new Role({ name: "User" });

    await Promise.all([adminRole.save(), userRole.save()]);
    console.log("Roles initialized succesfully");
  } catch (error) {
    console.log("An error happened while creating roles", error);
    process.exit(1);
  }
}
