class AliyunPanManager {
    constructor({refresh_token, access_token = null, token_refresh_callback = null, client_id = "", client_secret = "", base = 'https://openapi.aliyundrive.com', oauth_token_url = "https://api.nn.ci/alist/ali_open/token"}) {
        this.base = base;
        this.refresh_token = refresh_token;
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.oauth_token_url = oauth_token_url;
        this.access_token = access_token;
        this.drive_id = null;
        this.token_refresh_callback = token_refresh_callback;
    }

    update_token(access_token, refresh_token) {
        if (refresh_token) {
            this.refresh_token = refresh_token;
        }
        if (access_token) {
            this.access_token = access_token;
        }
    }

    async request(uri, method, data = {}, callback = null, retry = false) {
        let headers = { "Authorization": `Bearer ${this.access_token}` };
        if (method.toUpperCase() == "POST") {
            headers["Content-Type"] = "application/json";
        }

        let url = new URL(uri, this.base);
        if ('drive_id' in data && !data.drive_id) {
            if (!this.drive_id) {
                await this.get_drive_info();
            }
            data.drive_id = this.drive_id;
        }
        data = JSON.stringify(data);
        if (callback) {
            callback({ url, headers, data });
        }

        let response = await fetch(url, { method: method.toUpperCase(), headers, body: data });
        let response_data = await response.json();

        if (response_data.hasOwnProperty('code')) {
            if ((!retry && ["AccessTokenInvalid", "AccessTokenExpired", "I400JD"].includes(response_data['code'])) || this.access_token == "") {
                if (await this._refresh_token_req()) {
                    return await this.request(uri, method, JSON.parse(data), callback, true);
                }
            }
        }

        if (response.status != 200) {
            throw new Error(`AliyundriveOpenRsponseError, status = ${response.status}, reason = ${response.statusText}`);
        }
        if (response_data.hasOwnProperty('Message')) {
            throw new Error(`${response_data['Code']}:${response_data['Message']}`);
        }

        return response_data;
    }

    async _refresh_token_req() {
        let url = new URL("/oauth/access_token", this.base);

        if (this.oauth_token_url != "" && this.client_id == "") {
            url = this.oauth_token_url;
        }

        let data = JSON.stringify({
            "client_id": this.client_id,
            "client_secret": this.client_secret,
            "grant_type": "refresh_token",
            "refresh_token": this.refresh_token,
        });

        let headers = { 'Content-Type': 'application/json' };
        let response = await fetch(url, { method: "POST", headers, body: data });
        let response_data = await response.json();
        if (!response_data.hasOwnProperty("refresh_token")) {
            throw new Error("Failed to refresh token: refreshToken is empty");
        }

        this.refresh_token = response_data["refresh_token"];
        this.access_token = response_data["access_token"];
        if (this.token_refresh_callback) {
            this.token_refresh_callback(this.access_token, this.refresh_token);
        }

        return true;
    }

    async get_drive_info() {
        let uri = "/adrive/v1.0/user/getDriveInfo";
        let response_data = await this.request(uri, "POST");
        this.drive_id = response_data.default_drive_id;
    }

    async search_file(name, parent_file_id = '', type = 'file') {
        let uri = "/adrive/v1.0/openFile/search";

        let query = `name = '${name}' and type = '${type}'`;
        if (parent_file_id) {
            query += ` and parent_file_id = '${parent_file_id}'`;
        }

        let data = {
            "drive_id": this.drive_id,
            "query": query,
        };
        let response_data = await this.request(uri, "POST", data);
        return response_data.items || [];
    }

    // 获取文件列表 DESC ASC
    async fetch_open_file_list({parent_file_id, next_marker, limit = 200, order_direction = 'ASC'}) {
        const uri = '/adrive/v1.0/openFile/list';
        const method = 'POST';
        // created_at
        // updated_at
        // name
        // size
        const data = {
            "drive_id": this.drive_id,
            "limit": limit,
            "parent_file_id": parent_file_id,
            "order_by": "name",
            "order_direction": order_direction
        };
        if (next_marker) {
            data.marker = next_marker;
        }

        const response = await this.request(uri, method, data);
        return response;
    }

    async rename_file(file_id, new_name) {
        const uri = '/adrive/v1.0/openFile/update';
        const method = 'POST';
        const data = {
            "drive_id": this.drive_id,
            "file_id": file_id,
            "name": new_name
        };

        const response = await this.request(uri, method, data);
        return response;
    }
}

export default AliyunPanManager;