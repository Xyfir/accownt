import { STORAGE, NAME } from 'constants/config';
import * as speakeasy from 'speakeasy';
import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';
import * as qr from 'qrcode';

export async function setTOTP(
  userId: Accownt.User['id'],
  enabled: boolean
): Promise<{ url?: string; secret?: string }> {
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${userId}`);

  if (!enabled) {
    user.totpSecret = null;
    await storage.setItem(`user-${userId}`, user);
    return {};
  } else {
    const { ascii: secret } = speakeasy.generateSecret({
      issuer: NAME,
      length: 128,
      name: user.email
    });
    let url = speakeasy.otpauthURL({
      //algorithm: 'sha512',
      issuer: NAME,
      digits: 6,
      secret,
      label: `${NAME}:${encodeURIComponent(user.email)}`
    });
    url = await new Promise((resolve, reject) =>
      qr.toDataURL(url, (e, u) => (e ? reject(e) : resolve(u)))
    );

    user.totpSecret = secret;
    await storage.setItem(`user-${userId}`, user);

    return { url, secret };
  }
}