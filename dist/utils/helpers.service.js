"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Timeout helper to mimic sleep function with async/await pattern
 * @param { number } time - ms to wait before continue
 * @returns { Promise<any> }
 */
function timeout(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
exports.timeout = timeout;
/**
 * Validate email expression
 * @param email
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}
exports.validateEmail = validateEmail;
//# sourceMappingURL=helpers.service.js.map