import { create } from 'ipfs-http-client';
import { config } from '../config';

const client = create({ url: config.IPFSUploadUrl });

export const uploadNode2Ipfs = (name, created, ip, ownerDid, area, email, url, remark) =>
  new Promise((resolve, reject) => {
    // create the metadata object we'll be storing
    const metaObj = {
      version: '1',
      name,
      created,
      ip,
      owner_did: ownerDid,
      area,
      email,
      url,
      remark
    };
    try {
      const jsonMetaObj = JSON.stringify(metaObj);
      // add the metadata itself as well
      const metaRecv = Promise.resolve(client.add(jsonMetaObj));
      resolve(metaRecv);
    } catch (error) {
      reject(error);
    }
  });
