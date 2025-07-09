import { DriveAPIService } from "../apiService";
import { DriveCrypto } from "../../crypto";
import { DriveEventsService } from "../events";
import { ProtonDriveEntitiesCache, ProtonDriveCryptoCache, ProtonDriveAccount, ProtonDriveTelemetry } from "../../interface";
import { NodeAPIService } from "./apiService";
import { NodesCache } from "./cache";
import { NodesEvents } from "./events";
import { NodesCryptoCache } from "./cryptoCache";
import { NodesCryptoService } from "./cryptoService";
import { SharesService } from "./interface";
import { NodesAccess } from "./nodesAccess";
import { NodesManagement } from "./nodesManagement";
import { NodesRevisons } from "./nodesRevisions";

export type { DecryptedNode, DecryptedRevision } from "./interface";
export { generateFileExtendedAttributes } from "./extendedAttributes";

/**
 * Provides facade for the whole nodes module.
 * 
 * The nodes module is responsible for handling node metadata, including
 * API communication, encryption, decryption, caching, and event handling.
 * 
 * This facade provides internal interface that other modules can use to
 * interact with the nodes.
 */
export function initNodesModule(
    telemetry: ProtonDriveTelemetry,
    apiService: DriveAPIService,
    driveEntitiesCache: ProtonDriveEntitiesCache,
    driveCryptoCache: ProtonDriveCryptoCache,
    account: ProtonDriveAccount,
    driveCrypto: DriveCrypto,
    driveEvents: DriveEventsService,
    sharesService: SharesService,
) {
    const api = new NodeAPIService(telemetry.getLogger('nodes-api'), apiService);
    const cache = new NodesCache(telemetry.getLogger('nodes-cache'), driveEntitiesCache);
    const cryptoCache = new NodesCryptoCache(telemetry.getLogger('nodes-cache'), driveCryptoCache);
    const cryptoService = new NodesCryptoService(telemetry, driveCrypto, account, sharesService);
    const nodesAccess = new NodesAccess(telemetry.getLogger('nodes'), api, cache, cryptoCache, cryptoService, sharesService);
    const nodesEvents = new NodesEvents(telemetry.getLogger('nodes-events'), driveEvents, cache, nodesAccess);
    const nodesManagement = new NodesManagement(api, cryptoCache, cryptoService, nodesAccess, nodesEvents);
    const nodesRevisions = new NodesRevisons(telemetry.getLogger('nodes'), api, cryptoService, nodesAccess);

    return {
        access: nodesAccess,
        management: nodesManagement,
        revisions: nodesRevisions,
        events: nodesEvents,
    };
}
