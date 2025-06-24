# Changelog

Every version is tagged using `cs` or `js` prefix following with `/v` and semver, e.g.: `js/v1.2.3`. Details about each version is tracked in this file.

## js/v0.0.9

* Add `getNodeUid` function
* Add `resendInvitation` function
* Update of CryptoProxy interface to follow web monorepo: interfaces for keys
* Update of `nodeDecryptionError` telemetry event: `nodeFolderExtendedAttributes` and `nodeActiveRevision` are now `nodeExtendedAttributes` field

## js/v0.0.8

* Fix external invitation for sharing
* Update of CryptoProxy interface to follow web monorepo: passphrase can be null

## js/v0.0.7

* Fix move operation: reusing passphrase session key

## js/v0.0.6

* Update of CryptoProxy interface to follow web monorepo: array of keys or single key can be passed
* Fix invitation: only main public key should be passed

## js/v0.0.5

* Add `getNode` function

## js/v0.0.4

* Initial version
