import config from "../config/config";

export default class HiveHubServer {
    static async getHiveNodes(nid?: string, ownerDid?: string) {
        let url = `${config.serverUrl}/api/hivehub/nodes`;
        let params = '';
        if (nid) {
            params = `nid=${nid}`;
        }
        if (ownerDid) {
            params += `${params ? '&' : ''}owner_did=${ownerDid}`;
        }
        url += params ? `?${params}` : '';
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': assistAPIKey
            // },
            // body: JSON.stringify(requestBody)
        });
        return await response.json();
    }

    static async isOnline(nodeRoot) {
        let url = `${nodeRoot}/api/v2/about/version`;
        try {
            const response = await fetch(url, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
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
}
