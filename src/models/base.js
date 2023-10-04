class Base {
  static async findBy(prisma, attr, value) {
    return await prisma.findUnique({
      where: {
        [attr]: value
      }
    })
  }

  static async find(prisma, id) {
    return await prisma.findUnique({
      where: {
        id
      }
    });
  }

  static async findAll(prisma, select = {}, where = {}, orderBy = {}) {
    return await prisma.findMany({
      select,
      where,
      orderBy
    });
  }

  static async destroy(prisma, id) {
    return await prisma.delete({
      where: {
        id
      }
    });
  }
}

export default Base;