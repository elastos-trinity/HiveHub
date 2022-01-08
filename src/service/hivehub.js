import config from "../config/config";

export default class HiveHubServer {
    static async getHiveNodes() {
        const response = await fetch(`${config.serverUrl}/api/hivehub/nodes`, {
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
}
