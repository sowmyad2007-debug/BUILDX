import { PrismaClient } from "@prisma/client";
import { INITIAL_VENUES, INITIAL_EQUIPMENT, INITIAL_VOLUNTEERS } from "../lib/database/initial-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CampusFlow AI Database...");

  // Seed Venues
  for (const v of INITIAL_VENUES) {
    await prisma.venue.upsert({
      where: { code: v.code },
      update: {},
      create: {
        id: v.id,
        name: v.name,
        code: v.code,
        capacity: v.capacity,
        location: v.location,
        availableEquipment: JSON.stringify(v.availableEquipment),
        wifiCoverage: v.wifiCoverage,
        isAccessible: v.isAccessible,
        suitabilityScore: v.suitabilityScore,
        status: v.status,
      },
    });
  }

  // Seed Equipment
  for (const eq of INITIAL_EQUIPMENT) {
    await prisma.equipment.upsert({
      where: { id: eq.id },
      update: {},
      create: {
        id: eq.id,
        name: eq.name,
        category: eq.category,
        totalQuantity: eq.totalQuantity,
        availableQuantity: eq.availableQuantity,
        allocatedQuantity: eq.allocatedQuantity,
        storageLocation: eq.storageLocation,
        status: eq.status,
      },
    });
  }

  // Seed Volunteers
  for (const vol of INITIAL_VOLUNTEERS) {
    await prisma.volunteer.upsert({
      where: { email: vol.email },
      update: {},
      create: {
        id: vol.id,
        name: vol.name,
        email: vol.email,
        phone: vol.phone,
        department: vol.department,
        skills: JSON.stringify(vol.skills),
        role: vol.role,
        availability: vol.availability,
        shiftCount: vol.shiftCount,
      },
    });
  }

  console.log("✅ Database seeded successfully with campus venues, equipment inventory, and volunteer squads.");
}

main()
  .catch((e) => {
    console.error("Seeding warning:", e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
