import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed alternatives data
  const alternatives = [
    {
      serviceName: 'Netflix',
      category: 'streaming',
      competitors: [
        {
          name: 'Hulu (ad-supported)',
          price: 7.99,
          features: ['Ad-supported streaming', 'Large content library'],
          savings: 8.0,
        },
        {
          name: 'Disney+ Bundle',
          price: 14.99,
          features: ['Disney+', 'Hulu', 'ESPN+'],
          savings: 1.0,
        },
        {
          name: 'Amazon Prime Video',
          price: 8.99,
          features: ['Prime Video', 'Prime shipping', 'Prime Music'],
          savings: 7.0,
        },
      ],
    },
    {
      serviceName: 'Spotify',
      category: 'music',
      competitors: [
        {
          name: 'Apple Music',
          price: 10.99,
          features: ['100M+ songs', 'Spatial Audio'],
          savings: 0.0,
        },
        {
          name: 'YouTube Music',
          price: 10.99,
          features: ['Music + YouTube Premium', 'Background play'],
          savings: 0.0,
        },
        {
          name: 'Amazon Music Unlimited',
          price: 9.99,
          features: ['90M+ songs', 'Alexa integration'],
          savings: 1.0,
        },
      ],
    },
    {
      serviceName: 'Adobe Creative Cloud',
      category: 'software',
      competitors: [
        {
          name: 'Affinity Suite',
          price: 54.99,
          features: ['One-time purchase', 'Photo, Designer, Publisher'],
          savings: 45.0,
        },
        {
          name: 'Canva Pro',
          price: 12.99,
          features: ['Design tools', 'Templates', 'Collaboration'],
          savings: 87.0,
        },
        {
          name: 'Figma',
          price: 12.0,
          features: ['UI/UX design', 'Collaboration', 'Prototyping'],
          savings: 88.0,
        },
      ],
    },
    {
      serviceName: 'Microsoft 365',
      category: 'software',
      competitors: [
        {
          name: 'Google Workspace',
          price: 6.0,
          features: ['Gmail', 'Drive', 'Docs', 'Sheets'],
          savings: 3.0,
        },
        {
          name: 'LibreOffice',
          price: 0.0,
          features: ['Free office suite', 'Open source'],
          savings: 9.0,
        },
        {
          name: 'Apple iWork',
          price: 0.0,
          features: ['Pages', 'Numbers', 'Keynote', 'Free for Apple users'],
          savings: 9.0,
        },
      ],
    },
  ];

  for (const alt of alternatives) {
    await prisma.alternative.upsert({
      where: { serviceName: alt.serviceName },
      update: {
        competitors: alt.competitors,
        category: alt.category,
      },
      create: alt,
    });
  }

  console.log('Seeded alternatives data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
