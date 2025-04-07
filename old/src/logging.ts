import { configure } from 'log4js';

export default function setupLogging() {
    configure({
        appenders: {
            out: {
                type: "stdout"
            },
            app: {
                type: "file",
                "filename": "logs/application.log",
                "maxLogSize": 10000000,
                "backups": 5,
                "minLevel": "info"
            },
            access: {
                "type": "file",
                "filename": "logs/access.log",
                "maxLogSize": 10000000,
                "backups": 5,
                "minLevel": "info"
            }
        },
        categories: {
            default: {
                appenders: ["out", "app"],
                level: "info"
            },
            access:{
                appenders: ["access"],
                level: "debug"
            }
        }
    });
}
