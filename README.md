# io.Connect Desktop Configuration Service Example

[**io.Connect Desktop**](https://docs.interop.io/desktop/getting-started/what-is-io-connect-desktop/general-overview/index.html) uses application, layout, system and other configurations defined on the local machine, but can also be reconfigured to fetch them from a REST service.

This example project shows how to run a Node.js REST service that provides configuration stores for **io.Connect Desktop**.

Note that this is a sample implementation and some parts of it must be extended to work well in a multi-user scenario.

## Configuration and Start

This example uses application definitions in JSON format located in the `configuration\DEMO-T42\apps` folder. Layout definitions are fetched from and saved in the `configuration\DEMO-T42\layouts` folder. You can also use your own application definitions, but they must be in the standard io.Connect Desktop [application definition](https://docs.interop.io/desktop/developers/configuration/application/index.html) format. System and other configuration files are located in the `configuration\DEMO-T42\configs` folder.

To start:

```cmd
npm i           // install the dependencies
npm run start   // run the server
```

This will start the service on port 8004.

## io.Connect Desktop Configuration

To enable fetching configuration definitions from the REST service, you need to edit your local configuration files located in the `%LOCALAPPDATA%\interop.io\io.Connect Desktop\Desktop\config` folder.

### Applications

To enable fetching application configurations from the REST store, find the `"appStores"` top-level key in the `system.json` file and add a new entry (or replace existing entries) with the following configuration:

```json
"appStores": [
    {
        "type": "rest",
        "details": {
            "url": "http://localhost:8004/apps/"
        }
    }
]
```

If you want to return apps in FDC3 format you need to set the `USE_FDC3` environment variable.

### Layouts

To enable fetching layouts from the REST store, find the `"layouts"` top-level key in the `system.json` file and edit the `"store"` property - change the `"type"` to `"rest"` and assign the URL of the service to the `"restURL"`:

```json
{
    "layouts": {
        "store": {
            "type": "rest",
            "restURL": "http://localhost:8004/layouts"
        }
    }
}
```

### Application Preferences

To enable reading and storing application preference from he REST store, find the `"applicationPreferences"` top-level key in the `system.json` file and edit the `"store"` property - change the `"type"` to `"rest"` and assign the URL of the service to the `"restURL"`:

```json
{
    "applicationPreferences": {
        "store": {
            "type": "rest",
            "restURL": "http://localhost:8004/prefs"
        }
    }
}
```
### System and Other Configurations

To enable fetching system or other configurations from the REST store, add a `"sources"` top-level key in the configuration file you want to extend - change the `"type"` to `"rest"` and assign the URL of the service to the `"source"` property:

```json
{
    "sources": [
       {
           "type": "rest",
           "source": "http://localhost:8004/configs",
           "configs": "system",
           "priority": 1
       }
   ]
}
```

## REST Service Configuration

### Port

By default, the server will listen on port 8004. The environment variable `SERVER_PORT` can be used to override this setting, e.g. to change the port to 8005 in the start script:

```json
{
    "scripts": {
        "start": "env SERVER_PORT=8005 && npm run build && node ./src/index.js"
    }
}
```

### Application Files

This example uses application definitions in JSON format located in the `configuration\apps` folder. The environment variable `APPS_FOLDER` can be used to override the default setting.

### Layout Files

This example reads and stores layouts from the `configuration\layouts` folder. The environment variable `LAYOUTS_FOLDER` can be used to override the default setting.

## User Identity

In this example, the user calling the service is not considered, and the returned data is the same for any user. In a real application, you may want to return a different set of applications per user, or to store layouts per user. To achieve this, you need to have information about the user identity - you can use the helper function `getUser()`, which returns the username of the user making the request.
