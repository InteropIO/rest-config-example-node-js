# Glue42 Configuration Service Example

[**Glue42 Enterprise**](https://glue42.com/desktop-enterprise/) uses application and layout configurations defined on the local machine, but can also be reconfigured to fetch them from a REST service.

This example project shows how to run an NodeJS REST service that provides [application](https://docs.glue42.com/glue42-concepts/application-management/overview/index.html#application_stores-rest_service_app_stores) and [layout](https://docs.glue42.com/glue42-concepts/windows/layouts/overview/index.html#layout_stores-rest_service_layout_store) stores for **Glue42 Enterprise**.

Note that this is a sample implementation and some parts of it must be extended to work well in a multi-user scenario.

## Configuration and Start

This example uses application definitions in JSON format located in the `configuration\apps` folder. Layout definitions are fetched from and saved in the `configuration\layouts` folder. You can also use your own application definitions, but they must be in the standard Glue42 [application definition](https://docs.glue42.com/developers/configuration/application/index.html) format.

To start:
```cmd
npm i           // install the dependencies
npm run start   // run the server
```

This will start the service on port 8004.

## Glue42 Enterprise Configuration

To enable fetching application and layout definitions from the REST service, you need to edit the `appStores` and `layouts` top-level keys in the **Glue42 Enterprise** `system.json` file, usually located in the `%LOCALAPPDATA%\Tick42\GlueDesktop\config` folder.

### Applications

Find the `appStores` top-level key in the `system.json` file and add a new entry (or replace existing entries) with the following configuration:

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

### Layouts

Find the `layouts` top-level key in the `system.json` file and edit the `store` property - change the `type` to `"rest"` and assign the URL of the service to the `restURL`:

```json
 "layouts": {
    "store": {
        "type": "rest",
        "restURL": "http://localhost:8004/"
      }
  } 

```

## Service configuration

### Port 

By default, the server will listen on port `8004`. The environment variable `SERVER_PORT` can be used to override this setting, e.g. to change the port to 8005 in the start script:
```
scripts:{
    "start": "env SERVER_PORT=8005 && npm run build && node ./src/index.js"
}
```

### Application files

This example uses application definitions in JSON format located in the `configuration\apps` folder. The env variable `APPS_FOLDER` can be used to override the setting.

### Layout files

This example reads and stores layouts from `configuration\layouts` folder. The env variable `LAYOUTS_FOLDER` can be used to override the setting.

## User identity
In this example the user calling the service is not considered, the data returned is the same for any user. In a real application you might want to return a different set of applications per user, or to store layouts per user.
To achieve this you need to have information about the user identity - there is a helper function *getUser* that returns the user name of the user doing the request.
