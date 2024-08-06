import * as jsonwebtoken from 'jsonwebtoken';
import { Jwt } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { TokenService } from './token-service';

const mockToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('TokenService', () => {
  describe('constructor', () => {
    it('should assign the correct properties', () => {
      const verifier = new TokenService({ tokenURI: 'A', tokenIssuer: 'B' });
      expect(verifier.jwtClient).toBeInstanceOf(JwksClient);
      expect(verifier._tokenIssuer).toBe('B');
    });
  });

  describe('_getDecodedToken', () => {
    it('should decode a valid token', () => {
      const verifier = new TokenService({ tokenURI: 'A', tokenIssuer: 'B' });
      const token = verifier._getDecodedToken(mockToken);
      expect(token).toStrictEqual({
        header: { alg: 'HS256', typ: 'JWT' },
        payload: { sub: '1234567890', name: 'John Doe', iat: 1516239022 },
        signature: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      });
    });

    it('should throw error trying to decode an invalid token', () => {
      expect.assertions(1);
      const verifier = new TokenService({ tokenURI: 'A', tokenIssuer: 'B' });
      try {
        verifier._getDecodedToken('IM A BAD TOKEN');
      } catch (err) {
        expect(err.message).toContain('Decoded token was undefined');
      }
    });
  });

  describe('_getTokenKeyId', () => {
    it('should retrieve the key id from jwt token', () => {
      const verifier = new TokenService({ tokenURI: 'A', tokenIssuer: 'B' });
      expect(verifier._getTokenKeyId({ header: { kid: 'KEYID' } } as unknown as Jwt)).toBe('KEYID');
    });

    it('should throw error when no key id in token', () => {
      expect.assertions(1);
      try {
        const verifier = new TokenService({ tokenURI: 'A', tokenIssuer: 'B' });
        verifier._getTokenKeyId({ header: { kid: undefined } } as unknown as Jwt);
      } catch (err) {
        expect(err.message).toContain('Token key ID was undefined.');
      }
    });
  });

  describe('_getPublicKeyFromTokenKeyId', () => {
    it('should return public key', async () => {
      const verifier = new TokenService({
        tokenURI: 'A',
        tokenIssuer: 'B'
      });

      const mockGetSigningKey = {
        getSigningKey: jest.fn().mockResolvedValue({ getPublicKey: jest.fn().mockReturnValue('PUBLIC KEY') })
      };

      verifier.jwtClient = mockGetSigningKey as unknown as JwksClient;

      const publicKey = await verifier._getPublicKeyFromTokenKeyId('ABC');

      expect(publicKey).toBe('PUBLIC KEY');
    });
  });

  describe('_verifyToken', () => {
    // TODO: Mock this correctly
    it.skip('should verify the token string against the public key', () => {
      const verifier = new TokenService({ tokenURI: 'A', tokenIssuer: 'B' });
      jest.spyOn(jsonwebtoken, 'verify').mockImplementation(() => 'Token');

      const token = verifier._verifyToken('A', 'B');
      expect(token).toBe('Token');
    });
  });

  describe('getVerifiedToken', () => {
    it('should pass correct values to each method', async () => {
      const verifier = new TokenService({ tokenURI: 'A', tokenIssuer: 'B' });

      jest.spyOn(verifier, '_getDecodedToken').mockImplementation(() => 'B' as any);
      jest.spyOn(verifier, '_getTokenKeyId').mockImplementation(() => 'C');
      jest.spyOn(verifier, '_getPublicKeyFromTokenKeyId').mockImplementation(() => 'D' as any);
      jest.spyOn(verifier, '_verifyToken').mockImplementation(() => 'E' as any);

      await verifier.getVerifiedToken('Bearer Token');
      expect(verifier._getDecodedToken).toHaveBeenCalledWith('Bearer Token');
      expect(verifier._getTokenKeyId).toHaveBeenCalledWith('B');
      expect(verifier._getPublicKeyFromTokenKeyId).toHaveBeenCalledWith('C');
      expect(verifier._verifyToken).toHaveBeenCalledWith('Bearer Token', 'D');
    });
  });
});
