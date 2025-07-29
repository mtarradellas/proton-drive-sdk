import { getMockLogger } from '../../tests/logger';
import {
    FolderExtendedAttributes,
    FileExtendedAttributesParsed,
    generateFolderExtendedAttributes,
    generateFileExtendedAttributes,
    parseFolderExtendedAttributes,
    parseFileExtendedAttributes,
} from './extendedAttributes';

describe('extended attrbiutes', () => {
    describe('should generate folder attributes', () => {
        const testCases: [Date | undefined, string | undefined][] = [
            [undefined, undefined],
            [new Date(1234567890000), '{"Common":{"ModificationTime":"2009-02-13T23:31:30.000Z"}}'],
        ];
        testCases.forEach(([input, expectedAttributes]) => {
            it(`should generate ${input}`, () => {
                const output = generateFolderExtendedAttributes(input);
                expect(output).toBe(expectedAttributes);
            });
        });
    });

    describe('should parse folder attributes', () => {
        const testCases: [string, FolderExtendedAttributes][] = [
            ['', {}],
            ['{}', {}],
            ['a', {}],
            [
                '{"Common": {"ModificationTime": "2009-02-13T23:31:30+0000"}}',
                {
                    claimedModificationTime: new Date(1234567890000),
                },
            ],
            ['{"Common": {"ModificationTime": "aa"}}', {}],
            [
                '{"Common": {"ModificationTime": "2009-02-13T23:31:30+0000", "Size": 123}}',
                {
                    claimedModificationTime: new Date(1234567890000),
                },
            ],
            ['{"Common": {"Whatever": 123}}', {}],
        ];
        testCases.forEach(([input, expectedAttributes]) => {
            it(`should parse ${input}`, () => {
                const output = parseFolderExtendedAttributes(getMockLogger(), input);
                expect(output).toMatchObject(expectedAttributes);
            });
        });
    });

    describe('should generate file attributes', () => {
        const testCases: [object, string | undefined][] = [
            [{}, undefined],
            [
                { modificationTime: new Date(1234567890000) },
                '{"Common":{"ModificationTime":"2009-02-13T23:31:30.000Z"}}',
            ],
            [{ size: undefined }, undefined],
            [{ size: 0 }, '{"Common":{"Size":0}}'],
            [{ size: 1234 }, '{"Common":{"Size":1234}}'],
            [{ blockSizes: [] }, undefined],
            [{ blockSizes: [4, 4, 4, 2] }, '{"Common":{"BlockSizes":[4,4,4,2]}}'],
            [{ digests: {} }, undefined],
            [{ digests: { sha1: 'abcdef' } }, '{"Common":{"Digests":{"SHA1":"abcdef"}}}'],
            [
                {
                    modificationTime: new Date(1234567890000),
                    size: 1234,
                    blockSizes: [4, 4, 4, 2],
                    digests: { sha1: 'abcdef' },
                },
                '{"Common":{"ModificationTime":"2009-02-13T23:31:30.000Z","Size":1234,"BlockSizes":[4,4,4,2],"Digests":{"SHA1":"abcdef"}}}',
            ],
        ];
        testCases.forEach(([input, expectedAttributes]) => {
            it(`should generate ${input}`, () => {
                const output = generateFileExtendedAttributes(input);
                expect(output).toBe(expectedAttributes);
            });
        });
    });

    describe('should parses file attributes', () => {
        const testCases: [string, FileExtendedAttributesParsed][] = [
            ['', {}],
            ['{}', {}],
            ['a', {}],
            [
                '{"Common": {"ModificationTime": "2009-02-13T23:31:30+0000"}}',
                {
                    claimedModificationTime: new Date(1234567890000),
                    claimedSize: undefined,
                    claimedDigests: undefined,
                    claimedAdditionalMetadata: undefined,
                },
            ],
            [
                '{"Common": {"Size": 123}}',
                {
                    claimedModificationTime: undefined,
                    claimedSize: 123,
                    claimedDigests: undefined,
                    claimedAdditionalMetadata: undefined,
                },
            ],
            [
                '{"Common": {"ModificationTime": "2009-02-13T23:31:30+0000", "Size": 123, "BlockSizes": [1, 2, 3]}}',
                {
                    claimedModificationTime: new Date(1234567890000),
                    claimedSize: 123,
                    claimedDigests: undefined,
                    claimedAdditionalMetadata: undefined,
                },
            ],
            [
                '{"Common": {"ModificationTime": "aa", "Size": 123}}',
                {
                    claimedModificationTime: undefined,
                    claimedSize: 123,
                    claimedDigests: undefined,
                    claimedAdditionalMetadata: undefined,
                },
            ],
            [
                '{"Common": {"ModificationTime": "2009-02-13T23:31:30+0000", "Size": "aaa"}}',
                {
                    claimedModificationTime: new Date(1234567890000),
                    claimedSize: undefined,
                    claimedDigests: undefined,
                    claimedAdditionalMetadata: undefined,
                },
            ],
            [
                '{"Common": {"Digests": {}}}',
                {
                    claimedModificationTime: undefined,
                    claimedSize: undefined,
                    claimedDigests: undefined,
                    claimedAdditionalMetadata: undefined,
                },
            ],
            [
                '{"Common": {"Digests": {"SHA1": null}}}',
                {
                    claimedModificationTime: undefined,
                    claimedSize: undefined,
                    claimedDigests: undefined,
                    claimedAdditionalMetadata: undefined,
                },
            ],
            [
                '{"Common": {"Digests": {"SHA1": "abcdef"}}}',
                {
                    claimedModificationTime: undefined,
                    claimedSize: undefined,
                    claimedDigests: { sha1: 'abcdef' },
                    claimedAdditionalMetadata: undefined,
                },
            ],
            [
                '{"Common": {}, "Media": {}}',
                {
                    claimedModificationTime: undefined,
                    claimedSize: undefined,
                    claimedDigests: undefined,
                    claimedAdditionalMetadata: {
                        Media: {},
                    },
                },
            ],
        ];
        testCases.forEach(([input, expectedAttributes]) => {
            it(`should parse ${input}`, () => {
                const output = parseFileExtendedAttributes(getMockLogger(), input);
                expect(output).toMatchObject(expectedAttributes);
            });
        });
    });
});
