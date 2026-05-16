import hashlib
import hmac
import base64
import json
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

class CryptoEngine:
    def __init__(self):
        # AES ব্লকের সাইজ ১৬ বাইট
        self.block_size = 16

    def generate_hmac(self, key_k1, message):
        """মেসেজ M এবং কি K1 ব্যবহার করে F1/F2 তৈরি করা"""
        byte_key = key_k1.encode('utf-8')
        byte_message = message.encode('utf-8')
        h = hmac.new(byte_key, byte_message, hashlib.sha256)
        return h.hexdigest()

    def _derive_aes_key(self, password_k2, fingerprint_bp, timestamp_t):
        """K2, BP এবং T থেকে একটি ३२-বাইটের AES কী তৈরি করা"""
        combined = f"{password_k2}{fingerprint_bp}{timestamp_t}"
        return hashlib.sha256(combined.encode()).digest()

    def encrypt_data(self, message, f1, k2, bp, t):
        """M + F1 কে K2, BP, T দিয়ে এনক্রিপ্ট করা"""
        combined_data = json.dumps({"M": message, "F1": f1})
        key = self._derive_aes_key(k2, bp, t)
        
        cipher = AES.new(key, AES.MODE_CBC)
        iv = cipher.iv # ইনপুট ভেক্টর
        
        ct_bytes = cipher.encrypt(pad(combined_data.encode(), self.block_size))
        
        # IV এবং সাইফারটেক্সট একত্রে বেস৬৪ করে পাঠানো হয়
        return base64.b64encode(iv + ct_bytes).decode('utf-8')

    def decrypt_data(self, encrypted_data, k2, bp, t):
        """Ciphertext ডিক্রিপ্ট করে M এবং F1 উদ্ধার করা"""
        try:
            data = base64.b64decode(encrypted_data)
            key = self._derive_aes_key(k2, bp, t)
            
            iv = data[:16]
            ct = data[16:]
            
            cipher = AES.new(key, AES.MODE_CBC, iv)
            pt_bytes = unpad(cipher.decrypt(ct), self.block_size)
            
            return json.loads(pt_bytes.decode('utf-8'))
        except Exception as e:
            return None
