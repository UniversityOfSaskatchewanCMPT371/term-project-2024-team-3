import Rollbar from "rollbar";

/**
 * throws an assertion error if the condition is not met
 * @param condition the condition, Throws error if the condition is false
 * @param message the message to log on rollbar and for the message
 * @param rollbar an instance of rollbar for error logging
 */
function assert(condition: any, message: string | null, rollbar: Rollbar) {
    if (!condition) {
        if (message) {
            rollbar.error(message);
            throw new Error(message);
        } else {
            throw new Error();
        }
    }
}

export default assert;
