const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const user = await prisma.users.create({
    data: {
      username: "test",
      password: 'test',
      created_at: new Date()
    }
  })
  console.log(user)
  if(user) {
  
  }
}
main()