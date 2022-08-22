import { config } from '../config';

export default class HiveHubServer {
  static async getHiveNodes(nid, ownerDid) {
    let url = `${config.serverUrl}/api/hivehub/nodes`;
    let params = '';
    if (nid) params = `nid=${nid}`;
    if (ownerDid) params += `${params ? '&' : ''}owner_did=${ownerDid}`;
    url += params ? `?${params}` : '';
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin' // include, *same-origin, omit
      // headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': assistAPIKey
      // },
      // body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    if (!data) {
      return [];
    }
    const nodes = await data.nodes;
    return nodes;
  }

  static async isOnline(nodeRoot) {
    const url = `${nodeRoot}/api/v2/about/version`;
    try {
      const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin' // include, *same-origin, omit
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': assistAPIKey
        // },
        // body: JSON.stringify(requestBody)
      });
      return response.status >= 200 && response.status < 300;
    } catch (e) {
      return false;
    }
  }

  static async addHiveNode(info) {
    console.log(`Add hive node with information: ${JSON.stringify(info)}`);
    const url = `${config.serverUrl}/api/hivehub/node`;
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        //     'Authorization': assistAPIKey
      },
      body: JSON.stringify({ node: info })
    });
    const json = await response.json();
    return json;
  }

  static async removeHiveNode(nid) {
    try {
      console.log(`Remove hive node with id: ${nid}`);
      const url = `${config.serverUrl}/api/hivehub/node?nid=${nid}`;
      const response = await fetch(url, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          //     'Authorization': assistAPIKey
        }
      });
      return response.ok;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
}
