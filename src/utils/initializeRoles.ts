import Role from "../models/Role";

export default async function initializeRoles() {
  try {
    const roles = await Role.countDocuments();
    if (roles === 3) return;

    const adminRole = new Role({ name: "Admin" });
    const userRole = new Role({ name: "User" });
    const guestRole = new Role({ name: "Guest" });

    await Promise.all([adminRole.save(), userRole.save(), guestRole.save()]);
    console.log("Roles initialized succesfully");
  } catch (error) {
    console.log("An error happened while creating roles", error);
    process.exit(1);
  }
}
