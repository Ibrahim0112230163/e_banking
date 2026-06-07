// Frontend crypto utility to match backend crypto.py
import CryptoJS from 'crypto-js';

export class FrontendCryptoEngine {
  private blockSize = 16;

  /**
   * Generate HMAC using K1 and message
   */
  generateHmac(keyK1: string, message: string): string {
    return CryptoJS.HmacSHA256(message, keyK1).toString();
  }

  /**
   * Derive AES key from K2, BP, and T
<<<<<<< HEAD
   */
  private deriveAesKey(k2: string, bp: string, t: string): string {
    const combined = `${k2}${bp}${t}`;
    return CryptoJS.SHA256(combined).toString();
=======
   * AES_Key = HMAC-SHA256(K2_stretched, BP_hash || T)
   */
  private deriveAesKey(k2: string, bp: string, t: number): CryptoJS.lib.WordArray {
    // For fingerprint, use a fixed value = 123456 and hash it as usual (SHA-256)
    const fixedBp = CryptoJS.SHA256("123456").toString();
    const message = fixedBp + t.toString();
    const hmac = CryptoJS.HmacSHA256(message, k2);
    return hmac;
>>>>>>> origin/updated
  }

  /**
   * Encrypt data (M + F1) using K2, BP, T
<<<<<<< HEAD
   */
  encryptData(message: string, f1: string, k2: string, bp: string, t: string): string {
    try {
      const combinedData = JSON.stringify({ M: message, F1: f1 });
      const key = this.deriveAesKey(k2, bp, t);

      // Convert hex key to WordArray for CryptoJS
      const keyArray = CryptoJS.enc.Hex.parse(key);
=======
   * Returns { payload: base64, iv: base64 }
   */
  encryptData(message: string, f1: string, k2: string, bp: string, t: number): { payload: string; iv: string } {
    try {
      const combinedData = message + "|" + f1;
      const keyArray = this.deriveAesKey(k2, bp, t);
>>>>>>> origin/updated
      
      // Generate a random IV
      const iv = CryptoJS.lib.WordArray.random(128/8);
      
      // Encrypt with AES-CBC
      const encrypted = CryptoJS.AES.encrypt(combinedData, keyArray, {
        mode: CryptoJS.mode.CBC,
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
      });

<<<<<<< HEAD
      // Concatenate IV + ciphertext and encode as base64 to match Python backend format
      // encrypted.ciphertext is the actual cipher bytes (before base64 encoding)
      const ciphertextWords = encrypted.ciphertext;
      const combined = iv.concat(ciphertextWords);
      return CryptoJS.enc.Base64.stringify(combined);
=======
      return {
        payload: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
        iv: iv.toString(CryptoJS.enc.Base64)
      };
>>>>>>> origin/updated
    } catch (error) {
      console.error('Encryption error details:', {
        message,
        f1Length: f1.length,
        k2Length: k2.length,
        bpLength: bp.length,
<<<<<<< HEAD
        tLength: t.length,
=======
        t,
>>>>>>> origin/updated
        error
      });
      throw error;
    }
  }

  /**
   * Decrypt ciphertext to get M and F1
   */
<<<<<<< HEAD
  decryptData(encryptedData: string, k2: string, bp: string, t: string): { M: string; F1: string } | null {
    try {
      const key = this.deriveAesKey(k2, bp, t);
      const keyArray = CryptoJS.enc.Hex.parse(key);

      const decrypted = CryptoJS.AES.decrypt(encryptedData, keyArray, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
=======
  decryptData(encryptedData: string, ivBase64: string, k2: string, bp: string, t: number): { M: string; F1: string } | null {
    try {
      const keyArray = this.deriveAesKey(k2, bp, t);
      const iv = CryptoJS.enc.Base64.parse(ivBase64);

      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(encryptedData) } as any, 
        keyArray, 
        {
          mode: CryptoJS.mode.CBC,
          iv: iv,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      const parts = decryptedString.split('|');
      if (parts.length < 2) return null;
      
      const f1 = parts.pop()!;
      const m = parts.join('|');
      
      return { M: m, F1: f1 };
>>>>>>> origin/updated
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }
<<<<<<< HEAD
=======

  /**
   * Decrypt the outer secure envelope sent by backend
   */
  decryptOuterEnvelope(envelopeDict: any, secretKey: string): any | null {
    try {
      const payload = envelopeDict.payload;
      const hmacVal = envelopeDict.hmac;
      const nonce = envelopeDict.nonce;
      const timestamp = envelopeDict.timestamp;

      if (!payload || !hmacVal || !nonce || timestamp === undefined || timestamp === null) {
        console.error("Missing envelope parameters");
        return null;
      }

      // Verify integrity HMAC
      const integrityStr = `${payload}|${timestamp}|${nonce}`;
      const expectedHmac = CryptoJS.HmacSHA256(integrityStr, secretKey).toString();

      if (expectedHmac !== hmacVal) {
        console.error("Outer envelope HMAC mismatch");
        return null;
      }

      // Decrypt payload
      const parts = payload.split(':');
      if (parts.length < 2) return null;
      const iv = CryptoJS.enc.Base64.parse(parts[0]);
      const ct = CryptoJS.enc.Base64.parse(parts[1]);
      const key = CryptoJS.enc.Utf8.parse(secretKey.slice(0, 32));

      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ct } as any,
        key,
        {
          mode: CryptoJS.mode.CBC,
          iv: iv,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedStr);
    } catch (error) {
      console.error("Outer envelope decryption failed:", error);
      return null;
    }
  }

  /**
   * Encrypt request data in the outer secure envelope format for the backend's decrypt_outer_envelope
   */
  encryptOuterEnvelope(dataDict: any, secretKey: string): { payload: string; hmac: string; nonce: string; timestamp: number } {
    try {
      const dataStr = JSON.stringify(dataDict);
      const key = CryptoJS.enc.Utf8.parse(secretKey.slice(0, 32));
      const iv = CryptoJS.lib.WordArray.random(128/8);

      const encrypted = CryptoJS.AES.encrypt(dataStr, key, {
        mode: CryptoJS.mode.CBC,
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
      });

      const ivB64 = iv.toString(CryptoJS.enc.Base64);
      const ctB64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
      const payload = `${ivB64}:${ctB64}`;

      const nonce = CryptoJS.lib.WordArray.random(128/8).toString();
      const timestamp = Math.floor(Date.now() / 1000);

      // Generate HMAC of payload|timestamp|nonce
      const integrityStr = `${payload}|${timestamp}|${nonce}`;
      const generatedHmac = CryptoJS.HmacSHA256(integrityStr, secretKey).toString();

      return {
        payload: payload,
        hmac: generatedHmac,
        nonce: nonce,
        timestamp: timestamp
      };
    } catch (error) {
      console.error("Outer envelope encryption failed:", error);
      throw error;
    }
  }
>>>>>>> origin/updated
}

export const cryptoEngine = new FrontendCryptoEngine();
