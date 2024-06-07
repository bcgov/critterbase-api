# Critterbase Developer Readme

## Tech Debt

1. Refactor important routers to use service/repository pattern
    - Measurements (qualitative and quantitative)
    - Family
    - Collection Units (Ecological Units)

2. Deprecate Location router/services/swagger
    - Location information is only created / updated when mutating capture and mortalities

3. Restructure project into better defined routers
    1. Reference data (lookup data / xref taxon data)
        - Potentially opening up access to reference data and restricting recorded data
        - ie: `GET api/reference/measurement/qualitative/{tsn}` - previously xref router
        - ie: `GET api/reference/sex` - previously lookup router
        - ie: `GET api/reference/marking/type` - previously lookup router
        - ie: `GET api/reference/marking/material` - previously lookup router
        ...
    1. Recorded data (critter / markings / captures...)

4. Consider strategy to properly deprecate old endpoints / tag api

5. Refactor messy bulk router/service code
