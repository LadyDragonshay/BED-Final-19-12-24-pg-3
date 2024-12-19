import { PrismaClient } from "@prisma/client";
import amenityData from '../src/data/amenities.json' with { type: 'json' };
import bookingData from '../src/data/bookings.json' with { type: 'json' };
import hostData from '../src/data/hosts.json' with { type: 'json' };
import propertyData from '../src/data/properties.json' with { type: 'json' };
import reviewData from '../src/data/reviews.json' with { type: 'json' };
import userData from '../src/data/users.json' with { type: 'json' };

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"]
});

async function main() {
  
  const { users } = userData;
  const { bookings } = bookingData;
  const { properties } = propertyData;
  const { reviews } = reviewData;
  const { hosts } = hostData;
  const { amenities } = amenityData;

  console.log('Starting to seed database...');

    // 1. Users
    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: user,
      });
    }
  
    // 2. Hosts
    for (const host of hosts) {
      await prisma.host.upsert({
        where: { id: host.id },
        update: {},
        create: host,
      });
    }
  
    // 3. Amenities
    for (const amenity of amenities) {
      await prisma.amenity.upsert({
        where: { id: amenity.id },
        update: {},
        create: amenity,
      });
    }
  
    // 4. Properties met Amenities
    for (const property of properties) {
      const amenityIds = amenities.slice(0, 3).map((a) => ({ id: a.id })); // Pak de eerste 3 amenities
      await prisma.property.upsert({
        where: { id: property.id },
        update: {},
        create: {
          id: property.id,
          host: {
            connect: {
              id: property.hostId
            }
          },
          title: property.title,
        description: property.description,
        location: property.location,
        pricePerNight: property.pricePerNight,
        bedroomCount: property.bedroomCount,
        bathRoomCount: property.bathRoomCount,
        maxGuestCount: property.maxGuestCount,
        rating: property.rating,
          amenities: {
            connect: amenityIds,
          },
        },
      });
    }
  
    // 5. Bookings
    for (const booking of bookings) {
      await prisma.booking.upsert({
        where: { id: booking.id },
        update: {},
        create: booking,
      });
    }
  
    // 6. Reviews
    for (const review of reviews) {
      await prisma.review.upsert({
        where: { id: review.id },
        update: {},
        create: review,
      });
    }
  }
  
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });