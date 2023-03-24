import { randomUUID } from "crypto";
import { prisma, request } from "../../utils/constants";
import { apiError } from "../../utils/types";
import {createNewFamily, deleteFamily, getAllChildren, getAllFamilies, getFamilyById, getImmediateFamily, getImmediateFamilyOfCritter, makeChildOfFamily, makeParentOfFamily, removeChildOfFamily, removeParentOfFamily, updateFamily} from './family.service'

let child;
beforeAll(async () => {
  const allCritters = await prisma.critter.findMany({
    take: 10
  });
  child = allCritters[0];
  const parent = allCritters[1];
  const child2 = allCritters[2];
  const childofchild = allCritters[3];

  let family = await prisma.family.findFirst({
    where: {
      family_label: 'TEST_FAM'
    }
  })
  if(!family) {
    family = await prisma.family.create({
      data: {family_label: 'TEST_FAM'}
    })
  }

  let subfamily = await prisma.family.findFirst({
    where: {
      family_label: 'TEST_FAM2'
    }
  })
  if(!subfamily) {
    subfamily = await prisma.family.create({
      data: {family_label: 'TEST_FAM2'}
    })
  }

  await prisma.family_child.create({
    data: { family_id: family.family_id, child_critter_id: child.critter_id}
  })
  await prisma.family_child.create({
    data: { family_id: family.family_id, child_critter_id: child2.critter_id}
  })
  await prisma.family_parent.create({
    data: { family_id: family.family_id, parent_critter_id: parent.critter_id}
  })
  await prisma.family_parent.create({
    data: {family_id: subfamily.family_id, parent_critter_id: child.critter_id}
  });
  await prisma.family_child.create({
    data: {family_id: subfamily.family_id, child_critter_id: childofchild.critter_id }
  })

})

describe("API: Family", () => {
  describe("SERVICES", () => {
    describe("getting families", () => {
      it("should obtain all families", async () => {
        const families = await getAllFamilies();
        expect.assertions(1);
        expect(families.length).toBeGreaterThanOrEqual(1);
      });
      it("should get all children", async () => {
        const children = await getAllChildren();
        expect.assertions(1);
        expect(children.length).toBeGreaterThanOrEqual(1);
      });
      it("should get all parents", async () => {
        const parents = await getAllFamilies();
        expect.assertions(1);
        expect(parents.length).toBeGreaterThanOrEqual(1);
      });
      it("should be able to obtain TEST_FAM by uuid", async () => {
        const family = await prisma.family.findFirst({
          where: {
            family_label: 'TEST_FAM'
          }
        });
        if(!family) throw apiError.serverIssue();
        const f = await getFamilyById(family?.family_id);
        expect.assertions(1);
        expect(f?.family_id).toBe(family.family_id);
      });
      it("should obtain the immediate family of a critter, including parents, siblings, children", async () => {
        const family = await getImmediateFamilyOfCritter(child.critter_id);
        console.log(family);
        expect.assertions(3);
        expect(family.children.length).toBeGreaterThanOrEqual(1);
        expect(family.parents.length).toBeGreaterThanOrEqual(1);
        expect(family.siblings.length).toBeGreaterThanOrEqual(1);
      })
    });
    describe("creating entries", () => {
      it("should create a new family", async () => {
        const family = await createNewFamily('NEW_FAMILY');
        expect.assertions(1);
        expect(family.family_label).toBe('NEW_FAMILY');
      });
      it("should create a new parent", async () => {
        const critter = await prisma.critter.findFirst({
          where: { wlh_id: "17-10754"}
        });
        const family = await prisma.family.findFirst({
          where: { family_label: 'NEW_FAMILY'}
        })
        if(!critter || !family) throw apiError.serverIssue();
        const res = await makeParentOfFamily(family?.family_id, critter?.critter_id);
        expect.assertions(1);
        expect(res.parent_critter_id).toBe(critter?.critter_id);
      });
      it("should create a new child", async () => {
        const critter = await prisma.critter.findFirst({
          where: { wlh_id: "17-10773" }
        });
        const family = await prisma.family.findFirst({
          where: { family_label: 'NEW_FAMILY'}
        })
        if(!critter || !family) throw apiError.serverIssue();
        const res = await makeChildOfFamily(family?.family_id, critter?.critter_id);
        expect.assertions(1);
        expect(res.child_critter_id).toBe(critter?.critter_id);
      })
    })
    describe("modifying family", () => {
      it("should update this family label", async () => {
        const family = await prisma.family.findFirst({
          where: { family_label: 'NEW_FAMILY'}
        });
        if(!family) throw apiError.serverIssue();
        const res = await updateFamily(family?.family_id, { family_label: 'NEW_FAMILY2'});
        expect.assertions(1);
        expect(res.family_label).toBe('NEW_FAMILY2');
      });
      it("should remove a parent from a family", async () => {
        const critter = await prisma.critter.findFirst({
          where: { wlh_id: "17-10754"}
        });
        const family = await prisma.family.findFirst({
          where: { family_label: 'NEW_FAMILY2'}
        });
        if(!critter || !family) throw apiError.serverIssue();
        const res = await removeParentOfFamily(family?.family_id, critter?.critter_id);
        expect.assertions(1);
        expect(res.parent_critter_id).toBe(critter.critter_id);
      });
      it("should remove a child from a family", async () => {
        const critter = await prisma.critter.findFirst({
          where: { wlh_id: "17-10773"}
        });
        const family = await prisma.family.findFirst({
          where: { family_label: 'NEW_FAMILY2'}
        });
        if(!critter || !family) throw apiError.serverIssue();
        const res = await removeChildOfFamily(family?.family_id, critter?.critter_id);
        expect.assertions(1);
        expect(res.child_critter_id).toBe(critter.critter_id);
      });
      it("should delete a family entry entirely", async () => {
        const family = await prisma.family.findFirst({
          where: { family_label: 'NEW_FAMILY2'}
        });
        if(!family) throw apiError.serverIssue();
        const res = await deleteFamily(family.family_id);
        expect.assertions(1);
        expect(res.family_id).toBe(family.family_id);
      })
    });
  });
  describe("ROUTERS", () => {
    describe("GET /api/family/", () => {
      it("should return status 200", async () => {
        expect.assertions(2);
        const res = await request.get("/api/family/");
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      });
    });
    describe("POST /api/family/create", () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const res = await request.post("/api/family/create").send({family_label: 'NEW_FAMILY'});
        expect(res.status).toBe(201);
      })
    })
    describe("GET /api/family/:family_id", () => {
      it("should return status 200", async () => {
        expect.assertions(3);
        const family = await prisma.family.findFirst({
          where: {
            family_label: 'TEST_FAM'
          }
        });
        if(!family) throw apiError.serverIssue();
        const res = await request.get("/api/family/" + family.family_id);
        expect(res.status).toBe(200);
        expect(res.body.parents.length).toBeGreaterThanOrEqual(1);
        expect(res.body.children.length).toBeGreaterThanOrEqual(1);
      });
      it("should return status 404", async () => {
        expect.assertions(1);
        const res = await request.get("/api/family/" + randomUUID());
        expect(res.status).toBe(404);
      })
    });
    describe("PUT /api/family/:family_id", () => {
      it("should return status 200", async () => {
        const family = await prisma.family.findFirst({
          where: {
            family_label: 'TEST_FAM'
          }
        });
        if(!family) throw apiError.serverIssue();
        const res = await request.put("/api/family/" + family.family_id).send({family_label: 'FAM_TEST'});
        expect(res.status).toBe(200);
        expect(res.body.family_label).toBe('FAM_TEST');
      });
    })
    describe("DELETE /api/family/:family_id", () => {
      it("should return status 200", async () => {
        const family = await prisma.family.findFirst({
          where: {
            family_label: 'NEW_FAMILY'
          }
        });
        if(!family) throw apiError.serverIssue();
        const res = await request.delete("/api/family/" + family.family_id);
        expect(res.status).toBe(200);
        expect(res.body.family_label).toBe('NEW_FAMILY');
      })
    })
    describe("GET /api/family/children", () => {
      it("should return status 200", async () => {
        expect.assertions(2);
        const res = await request.get("/api/family/children/");
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      });
    });
    describe("GET /api/family/parents", () => {
      it("should return status 200", async () => {
        expect.assertions(2);
        const res = await request.get("/api/family/parents/");
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      })
    });
    describe("GET /api/family/parents/:critter_id", () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const res = await request.get("/api/family/parents/" + child.critter_id);
        expect(res.status).toBe(200);
      })
      it("should return status 404", async () => {
        expect.assertions(1);
        const res = await request.get("/api/family/parents/" + randomUUID());
        expect(res.status).toBe(404);
      })
    });
    describe("GET /api/family/children/:critter_id", () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const res = await request.get("/api/family/children/" + child.critter_id);
        expect(res.status).toBe(200);
      });
      it("should return status 404", async () => {
        expect.assertions(1);
        const res = await request.get("/api/family/children/" + randomUUID());
        expect(res.status).toBe(404);
      });
    });
    describe("POST /api/family/children/", () => {
      it("should return status 201", async () => {
        expect.assertions(1);
        const fam = await prisma.family.findFirst({
          where: {
            family_label: 'FAM_TEST'
          }
        });
        const critter = await prisma.critter.findFirst({
          where: { wlh_id: "17-10773" }
        });
        if(!fam || !critter) throw apiError.serverIssue();
        const res = await request.post("/api/family/children/").send(
          {
            family_id: fam.family_id,
            child_critter_id: critter.critter_id
          }
        );
        expect(res.status).toBe(201);
      });
      it("should return status 404, no critter found", async () => {
        const res = await request.post("/api/family/children/").send(
          {
            family_id: randomUUID(),
            child_critter_id: randomUUID()
          }
        );
        expect(res.status).toBe(404);
      })
      it("should return status 404, no family found", async () => {
        const res = await request.post("/api/family/children/").send(
          {
            family_id: randomUUID(),
            child_critter_id: child.critter_id
          }
        );
        expect(res.status).toBe(404);
      })
    })
    describe("DELETE /api/family/children/", () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const fam = await prisma.family.findFirst({
          where: {
            family_label: 'FAM_TEST'
          }
        });
        const critter = await prisma.critter.findFirst({
          where: { wlh_id: "17-10773" }
        });
        if(!fam || !critter) throw apiError.serverIssue();
        const res = await request.delete("/api/family/children/").send(
          {
            family_id: fam.family_id,
            child_critter_id: critter.critter_id
          }
        );
        expect(res.status).toBe(200);
      })
    })
      describe("POST /api/family/parents/", () => {
        it("should return status 201", async () => {
          expect.assertions(1);
          const fam = await prisma.family.findFirst({
            where: {
              family_label: 'FAM_TEST'
            }
          });
          const critter = await prisma.critter.findFirst({
            where: { wlh_id: "17-10754"}
          });
          if(!fam || !critter) throw apiError.serverIssue();
          const res = await request.post("/api/family/parents/").send(
            {
              family_id: fam.family_id,
              parent_critter_id: critter.critter_id
            }
          );
          expect(res.status).toBe(201);
        })
        it("should return status 404, no critter found", async () => {
          const res = await request.post("/api/family/parents/").send(
            {
              family_id: randomUUID(),
              parent_critter_id: randomUUID()
            }
          );
          expect(res.status).toBe(404);
        })
        it("should return status 404, no family found", async () => {
          const res = await request.post("/api/family/parents/").send(
            {
              family_id: randomUUID(),
              parent_critter_id: child.critter_id
            }
          );
          expect(res.status).toBe(404);
        })
      })
      describe("DELETE /api/family/parents/", () => {
        it("should return status 200", async () => {
          expect.assertions(1);
          const fam = await prisma.family.findFirst({
            where: {
              family_label: 'FAM_TEST'
            }
          });
          const critter = await prisma.critter.findFirst({
            where: { wlh_id: "17-10754"}
          });
          if(!fam || !critter) throw apiError.serverIssue();
          const res = await request.delete("/api/family/parents/").send(
            {
              family_id: fam.family_id,
              parent_critter_id: critter.critter_id
            }
          );
          expect(res.status).toBe(200);
        })
      })
      describe("GET /immediate/:critter_id", () => {
        it("should return status 200 and object with parents, children, sibling", async () => {
          expect.assertions(4);
          const res = await request.get("/api/family/immediate/" + child.critter_id);
          expect(res.status).toBe(200);
          expect(res.body.children.length).toBeGreaterThanOrEqual(1);
          expect(res.body.parents.length).toBeGreaterThanOrEqual(1);
          expect(res.body.siblings.length).toBeGreaterThanOrEqual(1);
        })
        it("should return status 404", async () => {
          expect.assertions(1);
          const res = await request.get("/api/family/immediate/" + randomUUID());
          expect(res.status).toBe(404);
        })
      });
      describe("GET /label/:label", () => {
        it("should return status 200", async () => {
          expect.assertions(1);
          const res = await request.get("/api/family/label/" + 'FAM_TEST');
          expect(res.status).toBe(200);
        })
      })
    })
});

afterAll(async () => {
  const cleanupThese = ['TEST_FAM','TEST_FAM2','FAM_TEST','NEW_FAMILY', 'NEW_FAMILY2']
  for(const f of cleanupThese) {
    const family = await prisma.family.findFirst({
      where: {
        family_label: f
      }
    });
    if(family) {
      await prisma.family_child.deleteMany({
        where: {
          family_id: family.family_id
        }
      })
      await prisma.family_parent.deleteMany({
        where: {
          family_id: family.family_id
        }
      })
      await prisma.family.delete({
        where: {
          family_id: family.family_id
        }
      })
    } 
  }

})