import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";


export class GetPrefsRequest {
    @ApiProperty({ description: 'If specified will return the preferences for a single app. '})
    @IsString()
    app: string;

    @ApiProperty({ description: 'If specified will return the preferences for the set of apps only.'})
    @IsDate()
    lastKnownUpdate?: Date;
}