import { NodeType, MemberRole, NonProtonInvitationState, MissingNode, ShareResult, PublicLink } from '../../interface';
import { PrivateKey, SessionKey } from '../../crypto';
import { EncryptedShare } from '../shares';
import { DecryptedNode } from '../nodes';

export enum SharingType {
    SharedByMe = 'sharedByMe',
    sharedWithMe = 'sharedWithMe',
}

/**
 * Internal interface for creating new invitation.
 */
export interface EncryptedInvitationRequest {
    addedByEmail: string;
    inviteeEmail: string;
    base64KeyPacket: string;
    base64KeyPacketSignature: string;
    role: MemberRole;
}

/**
 * Internal interface of existing invitation on the API.
 *
 * This interface is used only for managing the invitations. For listing
 * invitations with node metadata, see `EncryptedInvitationWithNode`.
 */
export interface EncryptedInvitation extends EncryptedInvitationRequest {
    uid: string;
    invitationTime: Date;
}

/**
 * Internal interface of existing invitation with the share and node metadata.
 *
 * Invitation with node is used for listing shared nodes with me, so it includes
 * what is being shared as well.
 */
export interface EncryptedInvitationWithNode extends EncryptedInvitation {
    share: {
        armoredKey: string;
        armoredPassphrase: string;
        creatorEmail: string;
    };
    node: {
        uid: string;
        type: NodeType;
        mediaType?: string;
        encryptedName: string;
    };
}

/**
 * Internal interface for creating new external invitation.
 */
export interface EncryptedExternalInvitationRequest {
    inviterAddressId: string;
    inviteeEmail: string;
    role: MemberRole;
    base64Signature: string;
}

/**
 * Internal interface of existing external invitation on the API.
 */
export interface EncryptedExternalInvitation extends Omit<EncryptedExternalInvitationRequest, 'inviterAddressId'> {
    uid: string;
    invitationTime: Date;
    addedByEmail: string;
    state: NonProtonInvitationState;
}

/**
 * Internal interface of existing member on the API.
 */
export interface EncryptedMember {
    uid: string;
    invitationTime: Date;
    addedByEmail: string;
    inviteeEmail: string;
    role: MemberRole;
    base64KeyPacket: string;
    base64KeyPacketSignature: string;
}

/**
 * Internal interface of existing member with the share and node metadata.
 */
export interface EncryptedBookmark {
    tokenId: string;
    creationTime: Date;
    share: {
        armoredKey: string;
        armoredPassphrase: string;
    };
    url: {
        encryptedUrlPassword?: string;
        base64SharePasswordSalt: string;
    };
    node: {
        type: NodeType;
        mediaType?: string;
        encryptedName: string;
        armoredKey: string;
        armoredNodePassphrase: string;
        file: {
            base64ContentKeyPacket?: string;
        };
    };
}

export interface EncryptedPublicLink {
    uid: string;
    creationTime: Date;
    expirationTime?: Date;
    role: MemberRole;
    flags: number;
    creatorEmail: string;
    publicUrl: string;
    numberOfInitializedDownloads: number;
    armoredUrlPassword: string;
    urlPasswordSalt: string;
    base64SharePassphraseKeyPacket: string;
    sharePassphraseSalt: string;
}

export interface EncryptedPublicLinkCrypto {
    base64SharePasswordSalt: string;
    base64SharePassphraseKeyPacket: string;
    armoredPassword: string;
}

export interface ShareResultWithCreatorEmail extends ShareResult {
    publicLink?: PublicLinkWithCreatorEmail;
}

export interface PublicLinkWithCreatorEmail extends PublicLink {
    creatorEmail: string;
}

/**
 * Interface describing the dependencies to the shares module.
 */
export interface SharesService {
    getMyFilesIDs(): Promise<{ volumeId: string }>;
    loadEncryptedShare(shareId: string): Promise<EncryptedShare>;
    getMyFilesShareMemberEmailKey(): Promise<{
        email: string;
        addressId: string;
        addressKey: PrivateKey;
    }>;
    isOwnVolume(volumeId: string): Promise<boolean>;
}

/**
 * Interface describing the dependencies to the nodes module.
 */
export interface NodesService {
    getNode(nodeUid: string): Promise<DecryptedNode>;
    getNodeKeys(nodeUid: string): Promise<{ key: PrivateKey }>;
    getNodePrivateAndSessionKeys(nodeUid: string): Promise<{
        key: PrivateKey;
        passphraseSessionKey: SessionKey;
        nameSessionKey: SessionKey;
    }>;
    getRootNodeEmailKey(nodeUid: string): Promise<{
        email: string;
        addressId: string;
        addressKey: PrivateKey;
    }>;
    iterateNodes(nodeUids: string[], signal?: AbortSignal): AsyncGenerator<DecryptedNode | MissingNode>;
    notifyNodeChanged(nodeUid: string): Promise<void>;
}

// TODO I think this can be removed
/**
 * Interface describing the dependencies to the nodes module.
 */
export interface NodesEvents {
    nodeUpdated(partialNode: { uid: string; shareId: string | undefined; isShared: boolean }): Promise<void>;
}
