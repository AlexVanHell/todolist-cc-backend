"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_log_debug_1 = require("ts-log-debug");
const app_1 = require("./app");
new app_1.Server()
    .start()
    .then(() => {
    ts_log_debug_1.$log.info('Server started...');
})
    .catch((err) => {
    ts_log_debug_1.$log.error(err);
});
//# sourceMappingURL=server.js.map