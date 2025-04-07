import { ApiProperty } from "@nestjs/swagger";

export class AppPreferencesDto {
    @ApiProperty({ description: 'The application name' })
    app: string;

    @ApiProperty({ description: 'The actual preferences for the applicaiton', type: Object, example: { prefferedLanguage: "en" } })
    data: Record<string, any>;

    @ApiProperty({ description: 'The last update time for the preferences of this applicaiton', type: Date })
    lastKnownUpdate: Date;
}