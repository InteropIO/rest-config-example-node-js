import { ApiProperty } from "@nestjs/swagger";

/**
 * This object contains many other properties (see a sample app definition in configuration/apps/) but we only need the 
 * name of the application in the server code.
 */
export class ApplicationDto {

    @ApiProperty({ description: 'The name of the application. For a full set of properties see https://docs.interop.io/desktop/developers/configuration/application/index.html ', example: 'client-list', type: String })
    name: string;
}