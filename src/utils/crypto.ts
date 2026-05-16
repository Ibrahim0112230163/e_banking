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
   */
  private deriveAesKey(k2: string, bp: string, t: string): string {
    const combined = `${k2}${bp}${t}`;
    return CryptoJS.SHA256(combined).toString();
  }

  /**
   * Encrypt data (M + F1) using K2, BP, T
   */
  encryptData(message: string, f1: string, k2: string, bp: string, t: string): string {
    try {
      const combinedData = JSON.stringify({ M: message, F1: f1 });
      const key = this.deriveAesKey(k2, bp, t);

      // Convert hex key to WordArray for CryptoJS
      const keyArray = CryptoJS.enc.Hex.parse(key);
      
      // Generate a random IV
      const iv = CryptoJS.lib.WordArray.random(128/8);
      
      // Encrypt with AES-CBC
      const encrypted = CryptoJS.AES.encrypt(combinedData, keyArray, {
        mode: CryptoJS.mode.CBC,
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Concatenate IV + ciphertext and encode as base64 to match Python backend format
      // encrypted.ciphertext is the actual cipher bytes (before base64 encoding)
      const ciphertextWords = encrypted.ciphertext;
      const combined = iv.concat(ciphertextWords);
      return CryptoJS.enc.Base64.stringify(combined);
    } catch (error) {
      console.error('Encryption error details:', {
        message,
        f1Length: f1.length,
        k2Length: k2.length,
        bpLength: bp.length,
        tLength: t.length,
        error
      });
      throw error;
    }
  }

  /**
   * Decrypt ciphertext to get M and F1
   */
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
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }
}

export const cryptoEngine = new FrontendCryptoEngine();
