import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";

export class RemovePrefsRequest {
    @ApiProperty({ description: 'If specified will return the preferences for a single app. '})
    @IsString()
    app?: string;
}