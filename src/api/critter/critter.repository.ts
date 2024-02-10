import { Repository } from "../../utils/base_classes";

export class CritterRepository extends Repository {
  async getAllCritters() {
    await this.prisma.$queryRaw`
      SELECT * FROM critter;
    `;
  }
}
