# OE-Controller

In the past we used to have some /{controller}/oe specific routes
These calls would be tailored specifically to RAW integrations.
Due to changes in the PCM project structure and deployment modifications, we will move all these functions / subroutes into 1 oe controller,
This way we have a single endpoint containing aal code for ERP integration, meaning we can swiftly change the way the controller behaves in ERP environment.

Authentication is not required for this endpoint as it should be limited to internal networks !

## Available routes pre-move (checkbox indicates wether route will be implemented)
- [x] /content/oe/:company/:objectType/:documentType/:objectId/:culture
- [ ] /content/OE/:company/:objectType/:documentType/:objectId/:culture
- [x] /content/oe/uuid/:company/:objectType/:documentType/:objectId/:culture
- [x] /objectlist/oe/:company/:objectType/:objectId
- [ ] /documentlist/oe/:directoryId/:datelastmodified?
- [ ] /documentlist/oe/:company/:objectType/:documentType/:datelastmodified?

## Available routes post-move (checkbox indicates wether route is implemented)
- [x] /oe/file/:uuid
- [x] /oe/file/:company/:objectType/:documentType/:objectId/:culture
- [x] /oe/file/uuid/:company/:objectType/:documentType/:objectId/:culture
- [x] /oe/objectlist/:company/:objectType/:objectId
- [x] /oe/documentlist/:directoryId/:dateLastModified?
- [x] /oe/documentlist/:company/:objectType/:documentType/:dateLastModified?