import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs' // Need to install bcryptjs? Or use web crypto in NextAuth? 
// NextAuth often uses bcrypt. I should check if I installed bcryptjs. I didn't.
const prisma = new PrismaClient()

async function main() {
    // Create Company Settings
    await prisma.companySettings.upsert({
        where: { id: 'default-company' },
        update: {},
        create: {
            id: 'default-company',
            name: 'Kool Joo',
            primaryColor: '#0070f3',
            workdays: 'Mon-Sat',
            dayOpenTimeDefault: '07:00',
            dayCloseTimeDefault: '18:00',
            sachetRetailPrice: 350,
            sachetSupplyPrice: 340,
            driverCommissionPerBag: 5,
            motorBoyCommissionPerBag: 3,
            dispenserDefaultRatePerBottle: 1000,
            currency: 'NGN'
        },
    })

    // Create Bank Account
    await prisma.bankAccount.createMany({
        data: [
            { label: 'Primary Bank', accountNumber: '1234567890', bankName: 'GTBank', isActive: true }
        ]
    })

    // Create Owner
    const password = await hash('password123', 12)
    const owner = await prisma.user.upsert({
        where: { username: 'owner' },
        update: {},
        create: {
            username: 'owner',
            email: 'owner@kooljoo.com',
            name: 'Owner User',
            password,
            role: 'OWNER',
        },
    })

    // Create Staff
    const staff = await prisma.user.upsert({
        where: { username: 'staff' },
        update: {},
        create: {
            username: 'staff',
            email: 'staff@kooljoo.com',
            name: 'Staff User',
            password, // same password
            role: 'STAFF',
        },
    })

    console.log({ owner, staff })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
