import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class AddPrefsRequest {
    @ApiProperty({ description: 'The app. '})
    @IsString()
    app: string;

    @ApiProperty({ description: 'If specified will return the preferences for the set of apps only.'})
    data?: Record<string, any>;
}